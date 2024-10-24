import { AddRouteParams } from '../TYPES'
import { buildModelHandler } from './routeHandlers'

export default function modelEditor(params: AddRouteParams) {
  return function (file: string): string {
    const { rsrcName, partialName, routeName } = params

    const currentModel = (file.match(/const .+Model = {(.|\n){0,}?}/gm) || [
      ''
    ])[0]

    if (!currentModel) {
      return file.substring(0, file.length - 1)
    }

    let newModel = currentModel
      .replace(/const .+Model.+{ ?\n?/gm, '')
      .replace('\n}', '')
      .replace('}', '')
      .trim()
    newModel = newModel.replaceAll(', ', ',\n  ')
    newModel = `const ${partialName || rsrcName}Model = {${
      newModel ? `\n  ${newModel},\n  ` : ' '
    }${routeName}${newModel ? '\n' : ' '}}`

    let newFile = file.replace(/const .+Model = {(.|\n){0,}?}/gm, newModel)
    newFile += buildModelHandler(params)

    return newFile
  }
}
