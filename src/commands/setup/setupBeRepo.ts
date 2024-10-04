import yargs, { Arguments } from 'yargs'

import { colorify, logger } from '../../lib/logger'
import CliCommand from '../../lib/CliCommand'
import packageManagerPrompt from '../../lib/prompts/packageManagerPrompt'
import repoBranchesPrompt from '../../lib/prompts/repoBranchesPrompt'
import selectPrompt from '../../lib/prompts/selectPrompt'

const COMMAND = 'setup-be-repo'

const REPO_TYPE_URL_MAP = {
  'JS-Service': 'git@github.com:heliumtank92/node-sls-esm-bp.git',
  'TS-Service': 'git@github.com:heliumtank92/node-sls-ts.git'
}

yargs.command(
  COMMAND,
  colorify.trace('Setup Backend Repository'),
  builder,
  handler
)

function builder(yargs: any): any {
  return yargs
    .option('repo-type', {
      description: 'Repository Type',
      type: 'string',
      choices: ['JS-Service', 'TS-Service'],
      required: false
    })
    .option('package-manager', {
      description: 'Package Manager',
      type: 'string',
      choices: ['npm', 'pnpm'],
      required: false
    })
    .option('branches', {
      description: 'Branches',
      type: 'array',
      choices: ['dev', 'staging', 'preprod'],
      required: false
    })
}

async function handler(argv: Arguments) {
  logger.initiate(`[${COMMAND}] Initiating...`)

  const packageManager = await packageManagerPrompt(
    argv.packageManager as string
  )

  const branches = await repoBranchesPrompt(argv.branches as string[])

  const repoType = (await selectPrompt(
    'Repository Type',
    ['JS-Service', 'TS-Service'],
    argv.repoType as string
  )) as keyof typeof REPO_TYPE_URL_MAP

  branches.forEach(branch => {
    new CliCommand(
      'Create Branch',
      `git checkout -b ${branch} && git push --set-upstream origin ${branch}`
    ).exec(false)
  })

  const boilerplateUrl = REPO_TYPE_URL_MAP[repoType]
  new CliCommand(
    'Add Boilerplate Remote',
    `git remote add boilerplate ${boilerplateUrl}`
  ).exec(false)

  new CliCommand(
    'Pull Boilerplate Master Branch',
    'git pull boilerplate master --allow-unrelated-histories --squash --rebase=false'
  ).exec(false)

  new CliCommand('Install Dependencies', `${packageManager} install`).exec(
    false
  )

  logger.complete(`[${COMMAND}] Completed!`)
}
