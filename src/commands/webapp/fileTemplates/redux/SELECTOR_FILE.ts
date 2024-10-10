const SELECTOR_FILE = `import { createSelector } from '@reduxjs/toolkit'

import { TAppStore } from '~/src/Configurations/AppStore'

export const SLICE_NAME = '{camelCase(reducerName)}'

const select = (state: TAppStore) => state[SLICE_NAME]

export const get{pascalCase(reducerName)}Reducer = select`

export default SELECTOR_FILE
