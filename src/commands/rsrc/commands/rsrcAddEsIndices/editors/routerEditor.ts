export default function routerEditor(rsrcName: string) {
  return function (file: string): string {
    const currentController = (file.match(/const (.|\n)+Controller?/gm) || [
      ''
    ])[0]

    if (!currentController) {
      return file.substring(0, file.length - 1)
    }

    let newController = currentController
      .replace(/const { ?\n?/gm, '')
      .replace(/(\n)?} =(\n)?.+Controller/, '')
      .trim()

    newController = newController.replaceAll(', ', ',\n  ')
    newController = `const {
  createIndices,
  removeIndices,
  indicesExists${
    newController ? `,\n  ${newController}\n` : '\n'
  }} = ${rsrcName}Controller`

    let newFile = file.replace(/const (.|\n)+Controller?/gm, newController)

    const noRoutes = file.includes('routesConfig: {}')
    if (noRoutes) {
      newFile = newFile.replace(
        'routesConfig: {}',
        `routesConfig: {
    createIndices: {
      method: 'POST',
      path: '/create-indices',
      pipeline: [createIndices]
    },
    removeIndices: {
      method: 'POST',
      path: '/remove-indices',
      pipeline: [removeIndices]
    },
    indicesExists: {
      method: 'GET',
      path: '/indices-exists',
      pipeline: [indicesExists]
    }
  }`
      )

      return newFile.substring(0, newFile.length - 1)
    }

    let currentConfig = (file.match(/routesConfig: {(.|\n)+?(\n {2}})/gm) || [
      ''
    ])[0]

    currentConfig = currentConfig
      .replace('routesConfig: {\n', '')
      .replace('\n  }', '')
      .trim()

    newFile = newFile.replace(
      /routesConfig: {(.|\n)+?(\n {2}})/gm,
      `routesConfig: {
    createIndices: {
      method: 'POST',
      path: '/create-indices',
      pipeline: [createIndices]
    },
    removeIndices: {
      method: 'POST',
      path: '/remove-indices',
      pipeline: [removeIndices]
    },
    indicesExists: {
      method: 'GET',
      path: '/indices-exists',
      pipeline: [indicesExists]
    },
    ${currentConfig}
  }`
    )

    return newFile.substring(0, newFile.length - 1)
  }
}
