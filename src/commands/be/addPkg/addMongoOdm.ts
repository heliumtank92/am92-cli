import fs from 'fs'
import yargs, { Arguments } from 'yargs'
import { colorify, logger } from '../../../lib/logger'
import inputReader from '../../../lib/inputReader'
import CliCommand from '../../../lib/CliCommand'
import { rewriteFile, writeFile } from '../../../lib/file'
import startServerEditor from './editors/startServerEditor'
import MONGO_ODM_CONFIG from './fileTemplates/envConfigs/MONGO_ODM_CONFIG'
import { getBERootPaths } from '../../../helpers/beInpurReader'

const COMMAND = 'be-add-mongo-odm'

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

  const { projectRoot } = getBERootPaths(argv)
  let packageManager = (argv.packageManager as string) || ''

  if (!packageManager) {
    const PACKAGE_MANAGER: string = 'npm'
    packageManager = inputReader('Package Manager', PACKAGE_MANAGER, true)
  }

  const installCmd =
    packageManager === 'pnpm'
      ? 'pnpm add @am92/mongo-odm'
      : 'npm i --save @am92/mongo-odm'

  new CliCommand('Install Mongo ODM', installCmd).exec(false)

  const startServerFilePath = `${projectRoot}/startServer.mjs`
  const newImports = `import { mongoConnect } from '@am92/mongo-odm'`
  const connection = '// Connect to MongoDB\n    await mongoConnect()'
  rewriteFile(
    'Start Server',
    startServerFilePath,
    startServerEditor(newImports, connection)
  )

  const devEnvFilePath = `${projectRoot}/.env.development`
  writeFile('Dev Env Config', MONGO_ODM_CONFIG, devEnvFilePath, true)

  logger.complete(`[${COMMAND}] Completed!`)
}
