import yargs, { Arguments } from 'yargs'
import fs from 'fs'
import { colorify, logger } from '../../lib/logger'
import inputReader from '../../lib/inputReader'
import CliCommand from '../../lib/CliCommand'
import { camelCase, pascalCase } from '../../lib/changeCase'
import { getFile } from '../../lib/getFile'

const COMMAND = 'webapp-create-reducer'

yargs.command(
  COMMAND,
  colorify.trace('Create a Reducer in React Webapp using Typescript'),
  builder,
  handler
)

function builder(yargs: any): any {
  return yargs
    .option('project-root-folder-path', {
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

  let projectRootPath = (argv.projectRootPath as string) || ''
  let reducerName = (argv.reducerName as string) || ''

  if (!projectRootPath) {
    const API_FOLDER_PATH: string = '.'
    projectRootPath = inputReader('Project Root Path', API_FOLDER_PATH, true)
  }

  if (!fs.existsSync(projectRootPath)) {
    logger.fatal(
      `[Error] Project does not exist at the location: ${projectRootPath}`
    )
    process.exit()
  }

  const srcFolderPath = `${projectRootPath}/src`
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
  new CliCommand('Create Action File', 'echo')
    .append(`"${actionGenerator()}"`)
    .append(`> ${reducerFolderPath}/Actions.ts`)
    .exec(false)

  // Create Selector File
  new CliCommand('Create Selector File', 'echo')
    .append(selectorGenerator(reducerName))
    .append(`> ${reducerFolderPath}/Selectors.ts`)
    .exec(false)

  // Create Reducer File
  new CliCommand('Create Reducer File', 'echo')
    .append(`"${reducerGenerator()}"`)
    .append(`> ${reducerFolderPath}/Reducer.ts`)
    .exec(false)

  // Read Routes Index
  const reducersFile = getFile(
    `${reduxFolderPath}/Reducers.ts`,
    `Failed to read file: ${reduxFolderPath}/Reducers.ts`,
    `Router Entry in ${reduxFolderPath}/Reducers.ts failed!`
  )

  // Build New Routes Index
  const newRoutesIndexFile = _buildNewReducersFile(reducersFile, reducerName)

  // Rewrite Routes Index
  new CliCommand('Rewrite Routes Index', 'echo')
    .append(`"${newRoutesIndexFile}"`)
    .append(`> ${reduxFolderPath}/Reducers.ts`)
    .exec(false)

  logger.complete(`[${COMMAND}] Completed!`)
}

function actionGenerator(): string {
  return `import { createAction } from '@reduxjs/toolkit'
import traceActionsCreator from '../traceActionsCreator'`
}

function selectorGenerator(reducerName: string): string {
  return `import { createSelector } from '@reduxjs/toolkit'

export const SLICE_NAME = '${camelCase(reducerName)}'

const select = (state: any) => state[SLICE_NAME]

export const get${pascalCase(reducerName)}Reducer = createSelector(
  select,
  (reducer: any) => reducer
)`
}

function reducerGenerator(): string {
  return `import {
  ActionReducerMapBuilder,
  CreateSliceOptions,
  createSlice
} from '@reduxjs/toolkit'
import { SLICE_NAME } from './Selectors'

const INITIAL_STATE = {}

const sliceOptions: CreateSliceOptions = {
  name: SLICE_NAME,
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers: (builder: ActionReducerMapBuilder<any>): void => {}
}

const slice = createSlice(sliceOptions)

export default slice.reducer`
}

function _buildNewReducersFile(
  reducersFile: string,
  reducerName: string
): string {
  let imports = (reducersFile.match(
    /((.|\n)+)?import(.|\n)+const reducers: ReducersMapObject = {/gm
  ) || [''])[0]

  if (!imports) {
    return reducersFile
  }

  imports = imports.replace(
    '\nconst reducers: ReducersMapObject = {',
    `\nimport ${reducerName}Reducer from './${reducerName}/Reducer'
import { SLICE_NAME as ${reducerName}SliceName } from './${reducerName}/Selectors'`
  )

  const reducers: string[] = reducersFile.match(/\[.+\]:.+Reducer/gm) || []
  reducers.push(`[${reducerName}SliceName]: ${reducerName}Reducer`)

  const postReducers = reducersFile.replace(
    /((.|\n)+)?import(.|\n)+const reducers: ReducersMapObject = {\n.*\[(.|\n)+?}\n/gm,
    ''
  )

  return `${imports}

const reducers: ReducersMapObject = {
  ${reducers.join(',\n  ')}
}
${postReducers.substring(0, postReducers.length - 1)}`
}
