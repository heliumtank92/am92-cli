import yargs, { Arguments } from 'yargs'
import fs from 'fs'
import { colorify, logger } from '../../lib/logger'
import inputReader from '../../lib/inputReader'
import CliCommand from '../../lib/CliCommand'
import { writeFile, rewriteFile } from '../../lib/file'
import { camelCase, pascalCase } from '../../lib/changeCase'

import ACTION_FILE from './fileTemplates/redux/ACTION_FILE'
import REDUCER_FILE from './fileTemplates/redux/REDUCER_FILE'
import SELECTOR_FILE from './fileTemplates/redux/SELECTOR_FILE'

const COMMAND = 'webapp-create-reducer'

yargs.command(
  COMMAND,
  colorify.trace('Create Reducer in React Webapp (Typescript)'),
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
    .option('reducer-name', {
      description: 'Reducer Name',
      type: 'string',
      required: false
    })
}

async function handler(argv: Arguments) {
  logger.initiate(`[${COMMAND}] Initiating...`)

  let projectRoot = (argv.projectRoot as string) || ''
  let reducerName = (argv.reducerName as string) || ''

  if (!projectRoot) {
    const API_FOLDER_PATH: string = '.'
    projectRoot = inputReader('Project Root Path', API_FOLDER_PATH, true)
  }

  if (!fs.existsSync(projectRoot)) {
    logger.fatal(
      `[Error] Project does not exist at the location: ${projectRoot}`
    )
    process.exit()
  }

  const srcFolderPath = `${projectRoot}/src`
  if (!fs.existsSync(srcFolderPath)) {
    logger.fatal(
      `[Error] Project Source Folder does not exist at the location: ${srcFolderPath}`
    )
    process.exit()
  }

  const reduxFolderPath = `${srcFolderPath}/Redux`
  if (!fs.existsSync(reduxFolderPath)) {
    logger.fatal(
      `[Error] Redux Folder does not exist at the location: ${reduxFolderPath}`
    )
    process.exit()
  }

  if (!reducerName) {
    const REDUCER_NAME = 'Sample'
    reducerName = inputReader('Reducer Name', REDUCER_NAME, true)
    reducerName = pascalCase(reducerName)
  }

  const reducerFolderPath = `${reduxFolderPath}/${reducerName}`
  if (fs.existsSync(reducerFolderPath)) {
    logger.fatal(
      `[Error] Reducer already exists at the location: ${reducerFolderPath}`
    )
    process.exit()
  }

  // Create Reducer Folder
  new CliCommand('Create Reducer Folder', `mkdir ${reducerFolderPath}`).exec(
    false
  )

  // Create Action File
  const action = ACTION_FILE.replaceAll('{reducerName}', reducerName)
  const actionLoc = `${reducerFolderPath}/Actions.ts`
  writeFile('Action File', action, actionLoc)

  // Create Selector File
  const selector = SELECTOR_FILE.replaceAll('{reducerName}', reducerName)
    .replaceAll('{camelCase(reducerName)}', camelCase(reducerName))
    .replaceAll('{pascalCase(reducerName)}', pascalCase(reducerName))
  const selectorLoc = `${reducerFolderPath}/Selectors.ts`
  writeFile('Selector File', selector, selectorLoc)

  // Create Reducer File
  const reducerLoc = `${reducerFolderPath}/Reducer.ts`
  writeFile('Reducer File', REDUCER_FILE, reducerLoc)

  const reducersFile = `${reduxFolderPath}/Reducers.ts`
  rewriteFile('Routes Index', reducersFile, _reducersFileEditor(reducerName))

  logger.complete(`[${COMMAND}] Completed!`)
}

function _reducersFileEditor(reducerName: string) {
  return function (file: string): string {
    let imports = (file.match(
      /((.|\n)+)?import(.|\n)+const reducers: ReducersMapObject = {/gm
    ) || [''])[0]

    if (!imports) {
      return file
    }

    imports = imports.replace(
      '\nconst reducers: ReducersMapObject = {',
      `\nimport ${reducerName}Reducer from './${reducerName}/Reducer'
import { SLICE_NAME as ${reducerName}SliceName } from './${reducerName}/Selectors'`
    )

    const reducers: string[] = file.match(/\[.+\]:.+Reducer/gm) || []
    reducers.push(`[${reducerName}SliceName]: ${reducerName}Reducer`)

    const postReducers = file.replace(
      /((.|\n)+)?import(.|\n)+const reducers: ReducersMapObject = {\n.*\[(.|\n)+?}\n/gm,
      ''
    )

    return `${imports}

const reducers: ReducersMapObject = {
  ${reducers.join(',\n  ')}
}
${postReducers.substring(0, postReducers.length - 1)}`
  }
}
