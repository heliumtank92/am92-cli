import fs from 'fs'
import yargs, { Arguments } from 'yargs'

import CliCommand from '../../../lib/CliCommand'
import { rewriteFile, writeFile } from '../../../lib/file'
import { colorify, logger } from '../../../lib/logger'
import beRootPathPrompt from '../../../lib/prompts/be/beRootPathPrompt'
import packageManagerPrompt from '../../../lib/prompts/packageManagerPrompt'

import startServerEditor from '../addPkg/editors/startServerEditor'
import REDIS_CONFIG from '../addPkg/fileTemplates/envConfigs/REDIS_CONFIG'
import REDIS_SDK from '../addPkg/fileTemplates/REDIS_SDK'

const COMMAND = 'be-add-redis'
const PKG_NAME = '@am92/redis'
const IMPORTS = `import redisSdk from './api/sdks/redisSdk.mjs'`
const CONNECTION = '// Connect to Redis\n    await redisSdk.connect()'

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

  const { startServerFilePath, devEnvFilePath, sdksFolderPath } =
    await beRootPathPrompt(argv.projectRoot as string)
  const packageManager = await packageManagerPrompt(
    argv.packageManager as string
  )

  const installCmd =
    packageManager === 'pnpm'
      ? `pnpm add ${PKG_NAME}`
      : `npm i --save ${PKG_NAME}`

  new CliCommand('Install Redis', installCmd).exec(false)

  if (!fs.existsSync(sdksFolderPath)) {
    new CliCommand('Create SDKs Folder', `mkdir ${sdksFolderPath}`).exec(false)
  }

  const redisSdkFilePath = `${sdksFolderPath}/redisSdk.mjs`
  writeFile('Redis Sdk', REDIS_SDK, redisSdkFilePath)

  rewriteFile(
    'Start Server',
    startServerFilePath,
    startServerEditor(IMPORTS, CONNECTION)
  )

  writeFile('Dev Env Config', REDIS_CONFIG, devEnvFilePath, true)

  logger.complete(`[${COMMAND}] Completed!`)
}
