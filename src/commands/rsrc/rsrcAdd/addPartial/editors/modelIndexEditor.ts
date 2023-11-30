export default function modelIndexEditor(
  rsrcName: string,
  partialName: string
) {
  return function (file: string): string {
    let imports = (file.match(
      /(((.|\n)+)?import(.|\n)+)?const .*Model = {/gm
    ) || [''])[0]

    const importsExtra = imports.includes('import')
      ? /\nconst .*Model = {/gm
      : /const .*Model = {/gm

    imports = imports.replace(
      importsExtra,
      `import ${partialName}Model from  './${partialName}.Model.mjs'`
    )

    let modelObject = (file.match(/const .*Model = {(.|\n?)+(Model)?}/gm) || [
      ''
    ])[0]
      .replace(/const .*Model = {/gm, '')
      .replace('\n}', '')
      .replace('}', '')

    return `${imports}

const ${rsrcName}Model = {${modelObject ? `${modelObject},` : ''}
  ...${partialName}Model
}

export default ${rsrcName}Model`
  }
}
