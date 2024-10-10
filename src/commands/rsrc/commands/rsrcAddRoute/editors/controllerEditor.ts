import { AddRouteParams } from '../TYPES'
import { buildControllerHandler } from './routeHandlers'

export default function controllerEditor(params: AddRouteParams) {
  return function (file: string): string {
    const { rsrcName, partialName, routeName } = params
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
    newController = `const ${partialName || rsrcName}Controller = {${
      newController ? `\n  ${newController},\n  ` : ' '
    }${routeName}${newController ? '\n' : ' '}}`

    let newFile = file.replace(/const .+Controller(.|\n)+?}/gm, newController)
    newFile += buildControllerHandler(params)

    return newFile
  }
}
