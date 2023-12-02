export default function routesEditor(
  rsrcName: string,
  partialName: string,
  routeName: string,
  routeMethod: string,
  routePath: string
) {
  return function (file: string): string {
    const currentController = (file.match(/const (.|\n)+Controller?/gm) || [
      ''
    ])[0]

    if (!currentController) {
      return file.substring(0, file.length - 1)
    }

    let newController = currentController
      .replace(/const { ?\n?/gm, '')
      .replace(/(\n)?} = .+Controller/, '')
      .trim()

    newController = newController.replaceAll(', ', ',\n  ')
    newController = `const {${
      newController ? `\n  ${newController},\n  ` : ' '
    }${routeName}${
      newController ? '\n' : ' '
    }} = ${rsrcName}${partialName}Controller`

    let newFile = file.replace(/const (.|\n)+Controller?/gm, newController)

    const noRoutes = file.includes(`const ${partialName}Routes = {}`)

    if (noRoutes) {
      newFile = newFile.replace(
        `const ${partialName}Routes = {}`,
        `const ${partialName}Routes = {
    ${routeName}: {
    method: '${routeMethod}',
    path: '${routePath}',
    pipeline: [${routeName}]
  }
}`
      )

      return newFile.substring(0, newFile.length - 1)
    }

    let currentRoutes = (file.match(/const .+Routes = (.|\n)+}/gm) || [''])[0]
    currentRoutes = currentRoutes
      .replace(/const .+Routes = {/gm, '')
      .replace('\n}', '')
      .trim()

    newFile = newFile.replace(
      /const .+Routes = (.|\n)+}/gm,
      `const ${partialName}Routes = {
  ${currentRoutes},
  ${routeName}: {
    method: '${routeMethod}',
    path: '${routePath}',
    pipeline: [${routeName}]
  }
}`
    )

    return newFile.substring(0, newFile.length - 1)
  }
}
