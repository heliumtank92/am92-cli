import yargs, { Arguments } from 'yargs'

import CliCommand from '../../../lib/CliCommand'
import { rewriteFile, writeFile } from '../../../lib/file'
import { colorify, logger } from '../../../lib/logger'
import beRootPathPrompt from '../../../lib/prompts/be/beRootPathPrompt'
import packageManagerPrompt from '../../../lib/prompts/packageManagerPrompt'

import startServerEditor from '../addPkg/editors/startServerEditor'
import MONGO_ODM_CONFIG from '../addPkg/fileTemplates/envConfigs/MONGO_ODM_CONFIG'

const COMMAND = 'be-add-mongo-odm'
const PKG_NAME = '@am92/mongo-odm'
const IMPORTS = `import { mongoConnect } from '@am92/mongo-odm'`
const CONNECTION = '// Connect to MongoDB\n    await mongoConnect()'

yargs.command(
  COMMAND,
  colorify.trace('Add MongoOdm in Backend'),
  builder,
  handler
)

function builder(yargs: any): any {
  return yargs
    .option('project-root', {
      description: 'Project Root Path',
      type: 'string',
      required: false
    })
    .option('package-manager', {
      description: 'Package Manager',
      type: 'string',
      choices: ['npm', 'pnpm'],
      required: false
    })
}

async function handler(argv: Arguments) {
  logger.initiate(`[${COMMAND}] Initiating...`)

  const { startServerFilePath, devEnvFilePath } = await beRootPathPrompt(
    argv.projectRoot as string
  )
  const packageManager = await packageManagerPrompt(
    argv.packageManager as string
  )

  const installCmd =
    packageManager === 'pnpm'
      ? `pnpm add ${PKG_NAME}`
      : `npm i --save ${PKG_NAME}`

  new CliCommand('Install Mongo ODM', installCmd).exec(false)

  rewriteFile(
    'Start Server',
    startServerFilePath,
    startServerEditor(IMPORTS, CONNECTION)
  )

  writeFile('Dev Env Config', MONGO_ODM_CONFIG, devEnvFilePath, true)

  logger.complete(`[${COMMAND}] Completed!`)
}
