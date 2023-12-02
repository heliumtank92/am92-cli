export default function apiRouterEditor(routeName: string) {
  return function (file: string): string {
    const noRoutes = file.includes('routesConfig: {}')
    let newFile = file

    if (noRoutes) {
      newFile = newFile.replace(
        'routesConfig: {}',
        `routesConfig: {
    ${routeName}: { enabled: true }
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
    ${routeName}: { enabled: true }
  }`
    )

    return newFile.substring(0, newFile.length - 1)
  }
}
