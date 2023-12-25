import fs from 'fs'
import yargs, { Arguments } from 'yargs'
import { colorify, logger } from '../../../lib/logger'
import inputReader from '../../../lib/inputReader'
import CliCommand from '../../../lib/CliCommand'
import { rewriteFile, writeFile } from '../../../lib/file'
import startServerEditor from './editors/startServerEditor'
import ES_ODM_CONFIG from './fileTemplates/envConfigs/ES_ODM_CONFIG'

const COMMAND = 'be-add-es-odm'

yargs.command(
  COMMAND,
  colorify.trace('Add OpensearchOdm in Backend'),
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

  let projectRoot = (argv.projectRoot as string) || ''
  let packageManager = (argv.packageManager as string) || ''

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

  if (!packageManager) {
    const PACKAGE_MANAGER: string = 'npm'
    packageManager = inputReader('Package Manager', PACKAGE_MANAGER, true)
  }

  const installCmd =
    packageManager === 'pnpm'
      ? 'pnpm add @am92/opensearch-odm'
      : 'npm i --save @am92/opensearch-odm'

  new CliCommand('Install Opensearch ODM', installCmd).exec(false)

  const startServerFilePath = `${projectRoot}/startServer.mjs`
  const newImports = `import { clientManager as opensearchClientManager } from '@am92/opensearch-odm'`
  const connection =
    '// Connect to OpenSearch\n    await opensearchClientManager.connect()'
  rewriteFile(
    'Start Server',
    startServerFilePath,
    startServerEditor(newImports, connection)
  )

  const devEnvFilePath = `${projectRoot}/.env.development`
  writeFile('Dev Env Config', ES_ODM_CONFIG, devEnvFilePath, true)

  logger.complete(`[${COMMAND}] Completed!`)
}
