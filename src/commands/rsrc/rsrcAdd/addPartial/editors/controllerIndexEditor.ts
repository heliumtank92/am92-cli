export default function controllerIndexEditor(
  rsrcName: string,
  partialName: string
) {
  return function (file: string): string {
    let imports = (file.match(
      /(((.|\n)+)?import(.|\n)+)?const .*Controller = {/gm
    ) || [''])[0]

    const importsExtra = imports.includes('import')
      ? /\nconst .*Controller = {/gm
      : /const .*Controller = {/gm

    imports = imports.replace(
      importsExtra,
      `import ${partialName}Controller from './${partialName}.Controller.mjs'`
    )

    let controllerObject = (file.match(
      /const .*Controller = {(.|\n?)+(Controller)?}/gm
    ) || [''])[0]
      .replace(/const .*Controller = {/gm, '')
      .replace('\n}', '')
      .replace('}', '')

    return `${imports}

const ${rsrcName}Controller = {${controllerObject ? `${controllerObject},` : ''}
  ...${partialName}Controller
}

export default ${rsrcName}Controller`
  }
}
