import fs from 'fs'
import yargs, { Arguments } from 'yargs'

import { pascalCase } from '../../../lib/changeCase'
import CliCommand from '../../../lib/CliCommand'
import { writeFile } from '../../../lib/file'
import { colorify, logger } from '../../../lib/logger'
import inputPrompt from '../../../lib/prompts/inputPrompt'
import feRootPathPrompt from '../../../lib/prompts/webapp/feRootPathPrompt'

import ENTITY_CONSTANTS_FILE from '../fileTemplates/entities/ENTITY_CONSTANTS_FILE'
import ENTITY_TYPES_FILE from '../fileTemplates/entities/ENTITY_TYPES_FILE'

const COMMAND = 'webapp-create-entity'

yargs.command(
  COMMAND,
  colorify.trace('Create Entity in React Webapp (Typescript)'),
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
    .option('entity-name', {
      description: 'Entity Name',
      type: 'string',
      required: false
    })
}

async function handler(argv: Arguments) {
  logger.initiate(`[${COMMAND}] Initiating...`)

  const { srcFolderPath } = await feRootPathPrompt(argv.projectRoot as string)
  const entityName = pascalCase(
    await inputPrompt('Entity Name', argv.entityName as string)
  )

  const entitiesPath = `${srcFolderPath}/Entities`
  const entityPath = `${entitiesPath}/${entityName}`

  if (!fs.existsSync(entitiesPath)) {
    new CliCommand('Create Entities Folder', `mkdir ${entitiesPath}`).exec(
      false
    )
  } else {
    if (fs.existsSync(entityPath)) {
      logger.fatal(`[Error] Entity already exists!`)
      process.exit()
    }
  }

  // Create Entity Folder
  new CliCommand('Create Entity Folder', `mkdir ${entityPath}`).exec(false)

  // Create Types File
  const types = ENTITY_TYPES_FILE.replaceAll('{entityName}', entityName)
  const typesLoc = `${entityPath}/${entityName}.Types.ts`
  writeFile('Types File', types, typesLoc)

  // Create Constants File
  const constants = ENTITY_CONSTANTS_FILE.replaceAll('{entityName}', entityName)
  const constantsLoc = `${entityPath}/${entityName}.Constants.ts`
  writeFile('Constants File', constants, constantsLoc)

  logger.complete(`[${COMMAND}] Completed!`)
}
