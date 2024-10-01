export default function routerEditor(
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
      .replace(/(\n)?} =(\n)?.+Controller/, '')
      .trim()

    newController = newController.replaceAll(', ', ',\n  ')
    newController = `const {${
      newController ? `\n  ${newController},\n  ` : ' '
    }${routeName}${newController ? '\n' : ' '}} = ${rsrcName}Controller`

    let newFile = file.replace(/const (.|\n)+Controller?/gm, newController)

    const noRoutes = file.includes('routesConfig: {}')
    if (noRoutes) {
      newFile = newFile.replace(
        'routesConfig: {}',
        `routesConfig: {
    ${routeName}: {
      method: '${routeMethod}',
      path: '${routePath}',
      pipeline: [${routeName}]
    }
  }`
      )

      return newFile.substring(0, newFile.length - 1)
    }

    let currentConfig = (file.match(/routesConfig: {(.|\n)+?(\n  })/gm) || [
      ''
    ])[0]

    currentConfig = currentConfig
      .replace('routesConfig: {\n', '')
      .replace('\n  }', '')
      .trim()

    newFile = newFile.replace(
      /routesConfig: {(.|\n)+?(\n  })/gm,
      `routesConfig: {
    ${currentConfig},
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
