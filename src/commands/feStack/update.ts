import yargs, { Arguments } from 'yargs'
import fs from 'fs'
import CliCommand from '../../lib/CliCommand'
import inputReader from '../../lib/inputReader'
import { colorify, logger } from '../../lib/logger'

const COMMAND = 'fe-stack-update'

yargs.command(
  COMMAND,
  colorify.trace('Update a Frontend Build in AWS'),
  builder,
  handler
)

function builder(yargs: any) {
  return yargs
    .option('aws-profile', {
      description: 'AWS Profile',
      type: 'string',
      required: false
    })
    .option('bucket-name', {
      description: 'S3 Bucket Name',
      type: 'string',
      required: false
    })
    .option('build-path', {
      description: 'Build Path',
      type: 'string',
      required: false
    })
    .option('cf-dist-id', {
      description: 'CloudFront Distribution ID',
      type: 'string',
      required: false
    })
}

async function handler(argv: Arguments) {
  logger.initiate(`[${COMMAND}] Initiating...`)

  let awsProfile = (argv.awsProfile as string) || ''
  let bucketName = (argv.bucketName as string) || ''
  let cfDistId = (argv.cfDistId as string) || ''
  let buildPath = (argv.buildPath as string) || ''

  if (!awsProfile) {
    const AWS_PROFILE = process.env.AWS_PROFILE || ''
    awsProfile = inputReader('AWS Profile', AWS_PROFILE, true)
  }

  if (!bucketName) {
    bucketName = inputReader('S3 Bucket Name', '', true)
  }

  if (!buildPath) {
    const BUILD_PATH: string = './build/'
    buildPath = inputReader('Build Path', BUILD_PATH, true)
  }

  if (!fs.existsSync(buildPath)) {
    logger.fatal(
      `[Error] Build Folder does not exist at the location: ${buildPath}`
    )
    process.exit()
  }

  if (!cfDistId) {
    cfDistId = inputReader('CloudFront Distribution ID', '', true)
  }

  // Delete Old Build
  new CliCommand('Delete Old Build', 'aws s3 rm')
    .appendArgs('recursive', `s3://${bucketName}/`)
    .appendArgs('profile', awsProfile)
    .exec()

  // Copy New Build
  new CliCommand('Copy New Build', `aws s3 cp`)
    .append(buildPath)
    .append(`s3://${bucketName}/`)
    .appendArgs('recursive')
    .appendArgs('cache-control', 'public, max-age=31557600')
    .appendArgs('profile', awsProfile)
    .exec()

  // Copy New Build Index
  new CliCommand('Copy New Build Index', `aws s3 cp`)
    .append(`${buildPath}/index.html`)
    .append(`s3://${bucketName}/`)
    .appendArgs('cache-control', 'no-cache, no-store')
    .appendArgs('profile', awsProfile)
    .exec()

  // Invalidate CloudFront
  new CliCommand('Invalidate CloudFront', 'aws cloudfront create-invalidation')
    .appendArgs('distribution-id', cfDistId)
    .appendArgs('paths', '/*')
    .appendArgs('profile', awsProfile)
    .exec()

  logger.complete(`[${COMMAND}] Completed!`)
}
