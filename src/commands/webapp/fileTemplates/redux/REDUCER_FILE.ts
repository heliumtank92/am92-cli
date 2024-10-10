const REDUCER_FILE = `import {
  ActionReducerMapBuilder,
  CreateSliceOptions,
  createSlice
} from '@reduxjs/toolkit'
import { SLICE_NAME } from './Selectors'
import { INITIAL_STATE, T_{constantCase(reducerName)}_REDUCER } from './Types'

const sliceOptions: CreateSliceOptions<T_{constantCase(reducerName)}_REDUCER> = {
  name: SLICE_NAME,
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers: (builder: ActionReducerMapBuilder<T_{constantCase(reducerName)}_REDUCER>): void => {}
}

const slice = createSlice(sliceOptions)

export default slice.reducer`

export default REDUCER_FILE
