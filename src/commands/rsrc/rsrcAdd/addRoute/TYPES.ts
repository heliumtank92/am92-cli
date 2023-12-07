export interface AddRouteParams {
  rsrcName: string
  rsrcPath: string
  partialName: string
  routeName: string
  routeMethod: string
  routePath: string
  routesFolderPath: string
  hasQuery: boolean
}

export const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD']

export const HAS_BODY: { [K: string]: boolean } = {
  GET: false,
  POST: true,
  PUT: true,
  PATCH: true,
  DELETE: true,
  HEAD: false
}

export interface ValidParams {
  modelPath: string
  controllerPath: string
  routerPath: string
  apiRouterPath: string
}
