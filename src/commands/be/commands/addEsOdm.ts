import yargs, { Arguments } from 'yargs'

import CliCommand from '../../../lib/CliCommand'
import { rewriteFile, writeFile } from '../../../lib/file'
import { colorify, logger } from '../../../lib/logger'
import beRootPathPrompt from '../../../lib/prompts/be/beRootPathPrompt'
import packageManagerPrompt from '../../../lib/prompts/packageManagerPrompt'

import startServerEditor from '../addPkg/editors/startServerEditor'
import ES_ODM_CONFIG from '../addPkg/fileTemplates/envConfigs/ES_ODM_CONFIG'

const COMMAND = 'be-add-es-odm'
const PKG_NAME = '@am92/opensearch-odm'
const IMPORTS = `import { clientManager as opensearchClientManager } from '@am92/opensearch-odm'`
const CONNECTION =
  '// Connect to OpenSearch\n    await opensearchClientManager.connect()'

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

  new CliCommand('Install Opensearch ODM', installCmd).exec(false)

  rewriteFile(
    'Start Server',
    startServerFilePath,
    startServerEditor(IMPORTS, CONNECTION)
  )

  writeFile('Dev Env Config', ES_ODM_CONFIG, devEnvFilePath, true)

  logger.complete(`[${COMMAND}] Completed!`)
}
