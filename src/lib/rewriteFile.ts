import fs from 'fs'
import { logger } from './logger'
import CliCommand from './CliCommand'

export default function rewriteFile(
  fileName: string,
  filePath: string,
  fileEditor: (file: string) => string
) {
  const file = getFile(filePath)

  const newFile = fileEditor(file)

  new CliCommand(`Rewrite ${fileName}`, 'echo')
    .append(`"${newFile}"`)
    .append(`> ${filePath}`)
    .exec(false)
}

function getFile(filePath: string): string {
  try {
    const indexRoutesFile = fs.readFileSync(filePath).toString('utf8')

    if (!indexRoutesFile.length) {
      process.exit()
    }

    return indexRoutesFile
  } catch (error) {
    logger.fatal(`Failed to read file: ${filePath}`)
    process.exit()
  }
}
