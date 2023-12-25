import fs from 'fs'
import yargs, { Arguments } from 'yargs'
import { colorify, logger } from '../../../lib/logger'
import inputReader from '../../../lib/inputReader'
import CliCommand from '../../../lib/CliCommand'
import { rewriteFile, writeFile } from '../../../lib/file'
import startServerEditor from './editors/startServerEditor'
import MONGO_ODM_CONFIG from './fileTemplates/envConfigs/MONGO_ODM_CONFIG'

const COMMAND = 'be-add-mongo-odm'

yargs.command(
  COMMAND,
  colorify.trace('Add MongoOdm in Backend'),
  builder,
  handler
)

function builder(yargs: any): any {
  return yargs.option('project-root', {
    description: 'Project Root Path',
    type: 'string',
    required: false
  })
}

async function handler(argv: Arguments) {
  logger.initiate(`[${COMMAND}] Initiating...`)

  let projectRoot = (argv.projectRoot as string) || ''

  if (!projectRoot) {
    const ROOT_FOLDER_PATH: string = '.'
    projectRoot = inputReader('Project Root Path', ROOT_FOLDER_PATH, true)
  }

  if (!fs.existsSync(projectRoot)) {
    logger.fatal(
      `[Error] Project does not exist at the location: ${projectRoot}`
    )
    process.exit()
  }

  const apiFolderPath = `${projectRoot}/api`
  if (!fs.existsSync(apiFolderPath)) {
    logger.fatal(
      `[Error] API Folder does not exist at the location: ${apiFolderPath}`
    )
    process.exit()
  }

  new CliCommand('Install Mongo ODM', 'npm i --save @am92/mongo-odm').exec(
    false
  )

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
