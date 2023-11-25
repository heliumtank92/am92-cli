export interface CreateParams {
  rsrcName: string
  routerMountPath: string
  rsrcPath: string
  routesFolderPath: string
}

export interface CreateFilesParams {
  createParams: CreateParams
  schemaGenerator?: (rsrcName: string) => string
  modelGenerator?: (rsrcName: string) => string
  controllerGenerator?: (rsrcName: string) => string
  routerGenerator?: (rsrcName: string) => string
  indexGenerator?: (rsrcName: string) => string
  apiRouterGenerator?: (rsrcName: string) => string
  routesIndexEntry?: boolean
}
