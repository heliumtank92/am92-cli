import { capitalCase } from '../../../../../lib/changeCase'

import { AddRouteParams, HAS_BODY } from '../TYPES'

export function buildModelHandler(params: AddRouteParams): string {
  const { routeName, routeMethod, routePath, hasQuery } = params
  return `\nasync function ${routeName}(${_getModelParams(
    routeMethod,
    routePath,
    hasQuery
  ).join(', ')}) {}`
}

export function buildControllerHandler(params: AddRouteParams): string {
  const { rsrcName, partialName, routeName, routeMethod, routePath, hasQuery } =
    params
  const readParams = routePath.includes(':')
  const hasBody = HAS_BODY[routeMethod]
  let destructure = ''

  if (readParams && hasBody) {
    destructure = `\n  const {
    params: { ${_getReqParams(routePath).join(', ')} },
    body: attrs${hasQuery ? ',\n    query' : ''}
  } = request`
  } else if (readParams && !hasBody) {
    destructure = `\n  const {${
      hasQuery ? '\n    ' : ' '
    }params: { ${_getReqParams(routePath).join(', ')} }${
      hasQuery ? ',\n    query\n  ' : ' '
    }} = request`
  } else if (!readParams && hasBody) {
    destructure = `\n  const { body: attrs${
      hasQuery ? ', query' : ''
    } } = request`
  } else {
    destructure = hasQuery ? `\n  const { query } = request` : ''
  }

  return `
async function ${routeName}(request, response, next) {${destructure}
  const data = await ${
    partialName || rsrcName
  }Model.${routeName}(${_getModelParams(routeMethod, routePath, hasQuery).join(
    ', '
  )})
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

function _getModelParams(
  routeMethod: string,
  routePath: string,
  hasQuery: boolean
) {
  const params: string[] = _getReqParams(routePath)

  if (HAS_BODY[routeMethod]) {
    params.push('attrs')
  }

  if (hasQuery) {
    params.push('query')
  }

  return params
}
