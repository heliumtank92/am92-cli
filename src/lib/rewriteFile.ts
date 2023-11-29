import fs from 'fs'
import { logger } from './logger'
import CliCommand from './CliCommand'
import { transformSync } from '@babel/core'

export default function rewriteFile(
  fileName: string,
  filePath: string,
  fileEditor: (file: string) => string
) {
  const file = getFile(filePath)

  const newFile = fileEditor(file)

  try {
    const options: any = {}

    if (filePath.match(/.ts$/gm)) {
      options.plugins = ['@babel/plugin-transform-typescript']
    } else if (filePath.match(/.tsx$/gm)) {
      options.plugins = [
        ['@babel/plugin-transform-typescript', { isTSX: true }]
      ]
    }

    transformSync(newFile, options)
  } catch (error) {
    logger.error(`[Error] Failed to rewrite file: ${filePath}`)
    return
  }

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
