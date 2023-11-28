const SELECTOR_FILE = `import { createSelector } from '@reduxjs/toolkit'

export const SLICE_NAME = '{camelCase(reducerName)}'

const select = (state: any) => state[SLICE_NAME]

export const get{pascalCase(reducerName)}Reducer = createSelector(
  select,
  (reducer: any) => reducer
)`

export default SELECTOR_FILE
