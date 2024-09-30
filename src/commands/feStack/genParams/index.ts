import yargs, { Arguments } from 'yargs'
import fs from 'fs'
import CliCommand from '../../../lib/CliCommand'
import { colorify, logger } from '../../../lib/logger'
import inputPromptWithOptions from '../../../lib/prompts/inputPromptWithOptions'

const COMMAND = 'fe-stack-gen-params'

yargs.command(
  COMMAND,
  colorify.trace('Generate Parameters File for FE Stack Creation'),
  builder,
  handler
)

function builder(yargs: any) {
  return yargs
    .option('out-dir', {
      description: 'Output Directory',
      type: 'string',
      required: false
    })
    .option('file-name', {
      description: 'Parameters File Name',
      type: 'string',
      required: false
    })
}

async function handler(argv: Arguments) {
  logger.initiate(`[${COMMAND}] Initiating...`)

  const outDir = await inputPromptWithOptions(
    'Output Directory:',
    ['./', '../'],
    argv.outDir as string
  )

  if (!fs.existsSync(outDir)) {
    logger.fatal(
      `[Error] Build Folder does not exist at the location: ${outDir}`
    )
    process.exit()
  }

  const fileName = await inputPromptWithOptions(
    'Parameters File Name:',
    ['parameters.json'],
    argv.fileName as string
  )

  const sourceFile = `${__dirname}/parameters.json`
  const destinationFile = `${outDir}/${fileName}`

  new CliCommand('Generate Parameters File', 'cp')
    .append(sourceFile)
    .append(destinationFile)
    .exec(false)

  logger.complete(`[${COMMAND}] Completed!`)
}
