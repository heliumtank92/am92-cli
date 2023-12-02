import { capitalCase } from '../../../../../lib/changeCase'
import { AddRouteParams, HAS_BODY } from '../TYPES'

export function buildModelHandler(params: AddRouteParams): string {
  const { routeName, routeMethod, routePath } = params
  return `\nasync function ${routeName}(${_getModelParams(
    routeMethod,
    routePath
  ).join(', ')}) {}`
}

export function buildControllerHandler(params: AddRouteParams): string {
  const { rsrcName, partialName, routeName, routeMethod, routePath } = params
  const readParams = routePath.includes(':')
  const hasBody = HAS_BODY[routeMethod]
  let destructure = ''
  if (readParams || hasBody) {
    destructure += `
  const {${
    readParams
      ? `\n    params: { ${_getReqParams(routePath).join(', ')} }${
          hasBody ? ',\n   ' : '\n  '
        }`
      : ''
  }${hasBody ? ` body: attrs${readParams ? '\n  ' : ' '}` : ''}} = request`
  }

  return `
async function ${routeName}(request, response, next) {${destructure}
  const data = await ${rsrcName}${partialName}Model.${routeName}(${_getModelParams(
    routeMethod,
    routePath
  ).join(', ')})
  const responseBody = new ResponseBody(200, '${rsrcName} ${capitalCase(
    routeName
  )} Successful', data)
  response.body = responseBody
  process.nextTick(next)
}`
}

function _getReqParams(routePath: string): string[] {
  return routePath.split('/').reduce((array: string[], urlPart) => {
    if (urlPart.includes(':')) {
      array.push(urlPart.replace(':', ''))
    }
    return array
  }, [])
}

function _getModelParams(routeMethod: string, routePath: string) {
  const params: string[] = _getReqParams(routePath)

  if (HAS_BODY[routeMethod]) {
    params.push('attrs')
  }

  return params
}
