import { AddRouteParams } from '../../addRoute/TYPES'
import { buildControllerHandler } from '../../addRoute/editors/routeHandlers'

export default function controllerEditor(rsrcName: string) {
  return function (file: string): string {
    const currentController = (file.match(/const .+Controller(.|\n)+?}/gm) || [
      ''
    ])[0]

    if (!currentController) {
      return file.substring(0, file.length - 1)
    }

    let newController = currentController
      .replace(/const .+Controller.+{ ?\n?/gm, '')
      .replace('\n}', '')
      .replace('}', '')
      .trim()
    newController = newController.replaceAll(', ', ',\n  ')
    newController = `const ${rsrcName}Controller = {
  createIndices,
  removeIndices,
  indicesExists${newController ? `,\n  ${newController}` : ''}
}`

    let newFile = file.replace(/const .+Controller(.|\n)+?}/gm, newController)
    let controllerParams: AddRouteParams = {
      rsrcName,
      partialName: '',
      routeName: 'createIndices',
      routeMethod: 'GET',
      routePath: '',
      hasQuery: false,
      rsrcPath: '',
      routesFolderPath: ''
    }
    newFile += buildControllerHandler(controllerParams)

    controllerParams.routeName = 'removeIndices'
    newFile += buildControllerHandler(controllerParams)

    controllerParams.routeName = 'indicesExists'
    newFile += buildControllerHandler(controllerParams)

    return newFile
  }
}
