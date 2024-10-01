import { rewriteFile } from '../../../../lib/file'
import apiRouterEditor from '../addRoute/editors/apiRouterEditor'
import { AddEsIndicesParams, ValidParams } from './TYPES'
import controllerEditor from './editors/controllerEditor'
import modelEditor from './editors/modelEditor'
import routerEditor from './editors/routerEditor'

export function fileStructHandler(
  params: AddEsIndicesParams,
  validParams: ValidParams
) {
  const { rsrcName } = params
  const { modelPath, controllerPath, routerPath, apiRouterPath } = validParams

  // Model Handling
  rewriteFile('Model Export', modelPath, modelEditor(rsrcName))

  // Controller Handling
  rewriteFile('Controller Export', controllerPath, controllerEditor(rsrcName))

  // Router Handling
  rewriteFile('Partial Routes', routerPath, routerEditor(rsrcName))

  // API Router Handling
  rewriteFile('API Router', apiRouterPath, apiRouterEditor('createIndices'))
  rewriteFile('API Router', apiRouterPath, apiRouterEditor('removeIndices'))
  rewriteFile('API Router', apiRouterPath, apiRouterEditor('indicesExists'))
}
