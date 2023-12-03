const SERVICE_ACTIONS = `
export const {serviceName}ServiceName = '{reducerName}/{serviceName}'
export const {serviceName}TraceActions = traceActionsCreator(
  {serviceName}ServiceName
)`

export default SERVICE_ACTIONS
