import yargs, { Arguments } from 'yargs'

import { camelCase, constantCase, pascalCase } from '../../../lib/changeCase'
import CliCommand from '../../../lib/CliCommand'
import { rewriteFile, writeFile } from '../../../lib/file'
import { colorify, logger } from '../../../lib/logger'
import feReducerPrompt from '../../../lib/prompts/webapp/feReducerPrompt'
import feRootPathPrompt from '../../../lib/prompts/webapp/feRootPathPrompt'

import ACTION_FILE from '../fileTemplates/redux/ACTION_FILE'
import REDUCER_FILE from '../fileTemplates/redux/REDUCER_FILE'
import SELECTOR_FILE from '../fileTemplates/redux/SELECTOR_FILE'
import TYPES_FILE from '../fileTemplates/redux/TYPES_FILE'

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

  const { srcFolderPath } = await feRootPathPrompt(argv.projectRoot as string)
  const { reducerName, reducerPath, reduxPath } = await feReducerPrompt(
    srcFolderPath,
    argv.reducerName as string,
    true
  )

  // Create Reducer Folder
  new CliCommand('Create Reducer Folder', `mkdir ${reducerPath}`).exec(false)

  // Create Types File
  const types = TYPES_FILE.replaceAll(
    '{constantCase(reducerName)}',
    constantCase(reducerName)
  )
  const typesLoc = `${reducerPath}/Types.ts`
  writeFile('Types File', types, typesLoc)

  // Create Action File
  const action = ACTION_FILE.replaceAll('{reducerName}', reducerName)
  const actionLoc = `${reducerPath}/Actions.ts`
  writeFile('Action File', action, actionLoc)

  // Create Selector File
  const selector = SELECTOR_FILE.replaceAll('{reducerName}', reducerName)
    .replaceAll('{camelCase(reducerName)}', camelCase(reducerName))
    .replaceAll('{pascalCase(reducerName)}', pascalCase(reducerName))
  const selectorLoc = `${reducerPath}/Selectors.ts`
  writeFile('Selector File', selector, selectorLoc)

  // Create Reducer File
  const reducerLoc = `${reducerPath}/Reducer.ts`
  const reducer = REDUCER_FILE.replaceAll(
    '{constantCase(reducerName)}',
    constantCase(reducerName)
  )
  writeFile('Reducer File', reducer, reducerLoc)

  // Edit Reducers File
  const reducersFile = `${reduxPath}/Reducers.ts`
  rewriteFile('Reducers File', reducersFile, _reducersFileEditor(reducerName))

  logger.complete(`[${COMMAND}] Completed!`)
}

function _reducersFileEditor(reducerName: string) {
  return function (file: string): string {
    let imports = (file.match(
      /((.|\n)+)?import(.|\n)+export type TReducers = {/gm
    ) || [''])[0]

    if (!imports) {
      return file
    }

    imports = imports.replace(
      '\nexport type TReducers = {',
      `\nimport ${reducerName}Reducer from './${reducerName}/Reducer'
import { SLICE_NAME as ${reducerName}SliceName } from './${reducerName}/Selectors'
import { T_${constantCase(reducerName)}_REDUCER } from './${reducerName}/Types'`
    )

    const reducerTypes: string[] = file.match(/\[.+\]:.+REDUCER/gm) || []
    reducerTypes.push(
      `[${reducerName}SliceName]: T_${constantCase(reducerName)}_REDUCER`
    )

    const postReducerTypes = file.replace(
      /((.|\n)+)?import(.|\n)+export type TReducers = {\n.*\[(.|\n)+?}\n/gm,
      ''
    )

    let newFile = `${imports}

export type TReducers = {
  ${reducerTypes.join(',\n  ')}
}
${postReducerTypes.substring(0, postReducerTypes.length - 1)}`

    const preReducers = (newFile.match(
      /((.|\n)+)?const reducers: ReducersMapObject<TReducers> = {/gm
    ) || [''])[0].replace(
      'const reducers: ReducersMapObject<TReducers> = {',
      ''
    )

    const reducers: string[] = file.match(/\[.+\]:.+Reducer/gm) || []
    reducers.push(`[${reducerName}SliceName]: ${reducerName}Reducer`)

    const postReducers = file.replace(
      /((.|\n)+)?import(.|\n)+const reducers: ReducersMapObject<TReducers> = {\n.*\[(.|\n)+?}\n/gm,
      ''
    )

    newFile = `${preReducers}const reducers: ReducersMapObject<TReducers> = {
  ${reducers.join(',\n  ')}
}
${postReducers.substring(0, postReducers.length - 1)}`

    return newFile
  }
}
