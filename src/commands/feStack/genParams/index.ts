import yargs, { Arguments } from 'yargs'
import fs from 'fs'
import CliCommand from '../../../lib/CliCommand'
import inputReader from '../../../lib/inputReader'
import { colorify, logger } from '../../../lib/logger'

const COMMAND = 'fe-stack-gen-params'

yargs.command(
  COMMAND,
  colorify.trace('Generate Parameters File for FE Stack Creation'),
  builder,
  handler
)

function builder(yargs: any) {
  return yargs.option('out-dir', {
    description: 'Output Directory',
    required: false
  })
}

async function handler(argv: Arguments) {
  logger.initiate(`[${COMMAND}] Initiating...`)

  let outDir = (argv.outDir as string) || ''

  if (!outDir) {
    const BUILD_PATH: string = './'
    outDir = inputReader('Output Directory', BUILD_PATH, true)
  }

  if (!fs.existsSync(outDir)) {
    logger.fatal(
      `[Error] Build Folder does not exist at the location: ${outDir}`
    )
    process.exit()
  }

  const sourceFile = `${__dirname}/parameters.json`
  const destinationFile = `${outDir}/parameters.json`

  // Delete Old Build
  new CliCommand('Generate Parameters File', 'cp')
    .append(sourceFile)
    .append(destinationFile)
    .exec(false)

  logger.complete(`[${COMMAND}] Completed!`)
}
