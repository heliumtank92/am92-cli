export default function routerIndexEditor(
  rsrcName: string,
  partialName: string
) {
  return function (file: string): string {
    let imports = (file.match(
      /(((.|\n)+)?import(.|\n)+)?const masterConfig = {/gm
    ) || [''])[0]

    const importsExtra = imports.includes('import')
      ? '\nconst masterConfig = {'
      : 'const masterConfig = {'

    imports = imports.replace(importsExtra, '')

    const routes = (file.match(/const masterConfig = {(.|\n)+?}/gm) || [''])[0]
      .replace('\n  }', '')
      .replace('}', '')

    let routerExport = (file.match(/export default (.|\n)+/gm) || [''])[0]
    routerExport = routerExport.substring(0, routerExport.length - 1)

    return `${imports}import ${partialName}Routes from './${partialName}.Routes.mjs'

${routes.includes('...') ? `${routes},` : `${routes}`}
    ...${partialName}Routes
  }
}

${routerExport}`
  }
}
