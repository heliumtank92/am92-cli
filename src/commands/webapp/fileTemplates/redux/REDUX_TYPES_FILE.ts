const REDUX_TYPES_FILE = `export interface T_{constantCase(reducerName)}_REDUCER {}

export const INITIAL_STATE: T_{constantCase(reducerName)}_REDUCER = {}`

export default REDUX_TYPES_FILE
