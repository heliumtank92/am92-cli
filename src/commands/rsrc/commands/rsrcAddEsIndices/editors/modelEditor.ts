export default function modelEditor(rsrcName: string) {
  return function (file: string): string {
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
    newModel = `const ${rsrcName}Model = {
  createIndices: ${rsrcName}Odm.createIndices,
  removeIndices: ${rsrcName}Odm.removeIndices,
  indicesExists: ${rsrcName}Odm.indicesExists${
    newModel ? `,\n  ${newModel}` : ''
  }
}`

    const newFile = file.replace(/const .+Model = {(.|\n){0,}?}/gm, newModel)

    return newFile
  }
}
