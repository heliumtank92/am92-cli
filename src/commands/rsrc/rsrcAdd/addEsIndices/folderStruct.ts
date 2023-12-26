import { rewriteFile, writeFile } from '../../../../lib/file'
import ES_INDICES_CONTROLLER_PARTIAL from '../../fileTemplates/controller/ES_INDICES_CONTROLLER_PARTIAL'
import ES_INDICES_MODEL_PARTIAL from '../../fileTemplates/model/ES_INDICES_MODEL_PARTIAL'
import ES_INDICES_ROUTES_PARTIAL from '../../fileTemplates/router/ES_INDICES_ROUTES_PARTIAL'
import controllerIndexEditor from '../addPartial/editors/controllerIndexEditor'
import modelIndexEditor from '../addPartial/editors/modelIndexEditor'
import routerIndexEditor from '../addPartial/editors/routerIndexEditor'
import apiRouterEditor from '../addRoute/editors/apiRouterEditor'
import { AddEsIndicesParams, ValidParams } from './TYPES'

export function folderStructHandler(
  params: AddEsIndicesParams,
  validParams: ValidParams
) {
  const { rsrcName } = params
  const {
    modelPath,
    modelIndexPath,
    controllerPath,
    controllerIndexPath,
    routerPath,
    routerIndexPath,
    apiRouterPath
  } = validParams

  // Model Handling
  const modelPartial = ES_INDICES_MODEL_PARTIAL.replaceAll(
    '{rsrcName}',
    rsrcName
  )
  writeFile('Indices Partial Model', modelPartial, modelPath)
  rewriteFile(
    'Model Index',
    modelIndexPath,
    modelIndexEditor(rsrcName, 'Indices')
  )

  // Controller Handling
  const controllerPartial = ES_INDICES_CONTROLLER_PARTIAL.replaceAll(
    '{rsrcName}',
    rsrcName
  )
  writeFile('Indices Partial Controller', controllerPartial, controllerPath)
  rewriteFile(
    'Controller Index',
    controllerIndexPath,
    controllerIndexEditor(rsrcName, 'Indices')
  )

  // Router Handling
  const routesPartial = ES_INDICES_ROUTES_PARTIAL.replaceAll(
    '{rsrcName}',
    rsrcName
  )
  writeFile('Indices Partial Routes', routesPartial, routerPath)
  rewriteFile(
    'Router Index',
    routerIndexPath,
    routerIndexEditor(rsrcName, 'Indices')
  )

  // API Router Handling
  rewriteFile('API Router', apiRouterPath, apiRouterEditor('createIndices'))
  rewriteFile('API Router', apiRouterPath, apiRouterEditor('removeIndices'))
  rewriteFile('API Router', apiRouterPath, apiRouterEditor('indicesExists'))
}
