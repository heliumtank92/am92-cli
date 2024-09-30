import yargs, { Arguments } from 'yargs'
import fs from 'fs'
import path from 'path'
import CliCommand from '../../../lib/CliCommand'
import { colorify, logger } from '../../../lib/logger'
import awsProfilePrompt from '../../../lib/prompts/awsProfilePrompt'
import awsRegionPrompt from '../../../lib/prompts/awsRegionPrompt'
import inputPrompt from '../../../lib/prompts/inputPrompt'
import inputPromptWithOptions from '../../../lib/prompts/inputPromptWithOptions'

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

  let awsProfile = await awsProfilePrompt(argv.awsProfile as string)
  let awsRegion = await awsRegionPrompt(argv.awsRegion as string)
  let stackName = await inputPrompt(
    'Enter CloudFormation Stack Name:',
    argv.stackName as string
  )
  let paramsFilePath = await inputPromptWithOptions(
    'Parameters File Location:',
    ['./parameters.json'],
    argv.paramsFilePath as string
  )

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

  logger.info(
    `[${COMMAND}] Please add 'A' Record in Route53 to the created CloudFront Distribution`
  )
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
