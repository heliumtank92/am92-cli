const IMPORT_REGEX = /((.|\n)+)?import(.|\n)+'\n/gm
const SERVER_LISTEN_REGEX = /\/\/ Start Server/
const SERVER_LISTEN = `// Start Server`

export default function startServerEditor(
  newImports: string,
  connection: string
) {
  return function (file: string): string {
    const imports = (file.match(IMPORT_REGEX) || [''])[0]
    let newFile = file.replace(IMPORT_REGEX, `${imports}${newImports}\n`)
    newFile = newFile.replace(
      SERVER_LISTEN_REGEX,
      `${connection}\n\n    ${SERVER_LISTEN}`
    )
    return newFile.substring(0, newFile.length - 1)
  }
}
