export default function routesIndexEditor(
  rsrcName: string,
  routerMountPath: string
): (file: string) => string {
  return (file: string): string => {
    let imports = (file.match(
      /(((.|\n)+)?import(.|\n)+)?const Routes = \[/gm
    ) || [''])[0]

    imports = imports.replace(
      `${imports.includes('import') ? '\n' : ''}const Routes = [`,
      `import ${rsrcName}Router from './${rsrcName}.mjs'`
    )

    let routes = (file.match(/const Routes = \[(.|\n?)+{ path(.|\n)+}/gm) || [
      ''
    ])[0].replace('const Routes = [', '')

    if (routes.indexOf('\n') === 0) {
      routes = routes.replace('\n', '')
    }

    routes = routes.trim()

    return `${imports}

const Routes = [
  ${
    routes ? `${routes},\n  ` : ''
  }{ path: '${routerMountPath}', router: ${rsrcName}Router }
]

export default Routes`
  }
}
