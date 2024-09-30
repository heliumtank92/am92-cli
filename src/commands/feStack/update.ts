import yargs, { Arguments } from 'yargs'
import fs from 'fs'
import CliCommand from '../../lib/CliCommand'
import { colorify, logger } from '../../lib/logger'
import awsProfilePrompt from '../../lib/prompts/awsProfilePrompt'
import awsS3BucketPrompt from '../../lib/prompts/awsS3BucketPrompt'
import inputPromptWithOptions from '../../lib/prompts/inputPromptWithOptions'
import inputPrompt from '../../lib/prompts/inputPrompt'
import awsCfDistPrompt from '../../lib/prompts/awsCfDistPrompt'

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

  let awsProfile = await awsProfilePrompt(argv.awsProfile as string)
  let bucketName = await awsS3BucketPrompt(
    awsProfile,
    argv.bucketName as string
  )
  let buildPath = await inputPromptWithOptions(
    'Build Path',
    ['./build/', './dist/'],
    argv.buildPath as string
  )

  if (!fs.existsSync(buildPath)) {
    logger.fatal(
      `[Error] Build Folder does not exist at the location: ${buildPath}`
    )
    process.exit()
  }

  let cfDistId = await awsCfDistPrompt(awsProfile, argv.cfDistId as string)

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
