import fs from 'fs'
import yargs, { Arguments } from 'yargs'
import { colorify, logger } from '../../../lib/logger'
import inputReader from '../../../lib/inputReader'
import CliCommand from '../../../lib/CliCommand'
import { rewriteFile, writeFile } from '../../../lib/file'
import startServerEditor from './editors/startServerEditor'
import REDIS_SDK from './fileTemplates/REDIS_SDK'
import REDIS_CONFIG from './fileTemplates/envConfigs/REDIS_CONFIG'
import { getBERootPaths } from '../../../helpers/beInpurReader'

const COMMAND = 'be-add-redis'

yargs.command(COMMAND, colorify.trace('Add Redis in Backend'), builder, handler)

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

  const { projectRoot, apiFolderPath } = getBERootPaths(argv)
  let packageManager = (argv.packageManager as string) || ''

  if (!packageManager) {
    const PACKAGE_MANAGER: string = 'npm'
    packageManager = inputReader('Package Manager', PACKAGE_MANAGER, true)
  }

  const installCmd =
    packageManager === 'pnpm'
      ? 'pnpm add @am92/redis'
      : 'npm i --save @am92/redis'

  new CliCommand('Install Redis', installCmd).exec(false)

  const sdksFolderPath = `${apiFolderPath}/sdks`
  if (!fs.existsSync(sdksFolderPath)) {
    new CliCommand('Create SDKs Folder', `mkdir ${sdksFolderPath}`).exec(false)
  }

  const redisSdkFilePath = `${sdksFolderPath}/redisSdk.mjs`
  writeFile('Redis Sdk', REDIS_SDK, redisSdkFilePath)

  const startServerFilePath = `${projectRoot}/startServer.mjs`
  const newImports = `import redisSdk from './api/sdks/redisSdk.mjs'`
  const connection = '// Connect to Redis\n    await redisSdk.connect()'
  rewriteFile(
    'Start Server',
    startServerFilePath,
    startServerEditor(newImports, connection)
  )

  const devEnvFilePath = `${projectRoot}/.env.development`
  writeFile('Dev Env Config', REDIS_CONFIG, devEnvFilePath, true)

  logger.complete(`[${COMMAND}] Completed!`)
}
