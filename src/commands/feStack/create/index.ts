import yargs, { Arguments } from 'yargs'
import fs from 'fs'
import path from 'path'
import CliCommand from '../../../lib/CliCommand'
import inputReader from '../../../lib/inputReader'
import { colorify, logger } from '../../../lib/logger'

const COMMAND = 'fe-stack-create'

yargs.command(
  COMMAND,
  colorify.trace('Create FE Stack in AWS'),
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
    .option('aws-region', {
      description: 'AWS Region',
      type: 'string',
      required: false
    })
    .option('stack-name', {
      description: 'CloudFormation Stack Name',
      type: 'string',
      required: false
    })
    .option('params-file-path', {
      description: 'Parameters File Location',
      type: 'string',
      required: false
    })
}

async function handler(argv: Arguments) {
  logger.initiate(`[${COMMAND}] Initiating...`)

  let awsProfile = (argv.awsProfile as string) || ''
  let awsRegion = (argv.awsRegion as string) || ''
  let stackName = (argv.stackName as string) || ''
  let paramsFilePath = (argv.paramsFilePath as string) || ''

  if (!awsProfile) {
    const AWS_PROFILE = process.env.AWS_PROFILE || ''
    awsProfile = inputReader('AWS Profile', AWS_PROFILE, true)
  }

  if (!awsRegion) {
    const AWS_REGION = process.env.AWS_REGION || ''
    awsRegion = inputReader('AWS Region', AWS_REGION, true)
  }

  if (!stackName) {
    stackName = inputReader('CloudFormation Stack Name', '', true)
  }

  if (!paramsFilePath) {
    const PARAMS_FILE_PATH = './parameters.json'
    paramsFilePath = inputReader(
      'Parameters File Location',
      PARAMS_FILE_PATH,
      true
    )
  }

  const templateBody = `file://${__dirname}/fe-stack.json`
  const paramsFileUrl = _getParamsFileUrl(paramsFilePath)

  new CliCommand('Stack Creation', 'aws cloudformation create-stack')
    .appendArgs('stack-name', stackName)
    .appendArgs('template-body', templateBody)
    .appendArgs('parameters', paramsFileUrl)
    .appendArgs('capabilities', 'CAPABILITY_IAM')
    .appendArgs('profile', awsProfile)
    .appendArgs('region', awsRegion)
    .exec()

  logger.info(`[${COMMAND}] Please add 'A' Record in Route53 to the created CloudFront Distribution`)
  logger.complete(`[${COMMAND}] Completed!`)
}

function _getParamsFileUrl(paramsFilePath: string): string {
  let paramsFileFullPath = ''

  if (paramsFilePath[0] === '.') {
    paramsFileFullPath = path.resolve(process.cwd(), paramsFilePath)
  } else {
    paramsFileFullPath = paramsFilePath
  }

  if (fs.existsSync(paramsFileFullPath)) {
    return `file://${paramsFileFullPath}`
  } else {
    logger.fatal(
      `[Error] Parameters File does not exist at the location: ${paramsFileFullPath}`
    )
    process.exit()
  }
}
