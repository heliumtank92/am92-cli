const REDUCER_FILE = `import {
  ActionReducerMapBuilder,
  CreateSliceOptions,
  createSlice
} from '@reduxjs/toolkit'
import { SLICE_NAME } from './Selectors'

export interface I_{constantCase(reducerName)}_STATE {}

const INITIAL_STATE: I_{constantCase(reducerName)}_STATE = {}

const sliceOptions: CreateSliceOptions = {
  name: SLICE_NAME,
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers: (builder: ActionReducerMapBuilder<any>): void => {}
}

const slice = createSlice(sliceOptions)

export default slice.reducer`

export default REDUCER_FILE
