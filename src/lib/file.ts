import fs from 'fs'
import { TransformOptions, transformSync } from '@babel/core'
import CliCommand from './CliCommand'
import { logger } from './logger'

export function getFile(filePath: string): string {
  try {
    const file = fs.readFileSync(filePath).toString('utf8')

    if (!file.length) {
      process.exit()
    }

    return file
  } catch (error) {
    logger.fatal(`Failed to read file: ${filePath}`)
    process.exit()
  }
}

export function writeFile(
  fileName: string,
  fileContent: string,
  filePath: string,
  append?: boolean
) {
  if (!fileContent) {
    !append &&
      new CliCommand(`Create ${fileName}`, `touch ${filePath}`).exec(false)
    return
  }

  if (!_validateFile(filePath, fileContent)) {
    return logger.error(`[Error] Failed to write file: ${filePath}`)
  }

  new CliCommand(`${append ? 'Append' : 'Create'} ${fileName}`, 'echo')
    .append(`"${_sanitizeFile(fileContent)}"`)
    .append(`${append ? '>>' : '>'} ${filePath}`)
    .exec(false)
}

export function rewriteFile(
  fileName: string,
  filePath: string,
  fileEditor: (file: string) => string
) {
  const file = getFile(filePath)
  const newFile = fileEditor(file)

  if (!_validateFile(filePath, newFile)) {
    return logger.error(`[Error] Failed to rewrite file: ${filePath}`)
  }

  new CliCommand(`Rewrite ${fileName}`, 'echo')
    .append(`"${_sanitizeFile(newFile)}"`)
    .append(`> ${filePath}`)
    .exec(false)
}

function _validateFile(filePath: string, fileContent: string): boolean {
  try {
    const options: TransformOptions = {}

    if (filePath.match(/.m?(j|t)s$/gm)) {
      options.filename = filePath
    } else if (filePath.match(/.ts$/gm)) {
      options.filename = filePath
      options.presets = [['@babel/preset-typescript', { allExtensions: true }]]
    } else if (filePath.match(/.tsx$/gm)) {
      options.filename = filePath
      options.presets = [
        ['@babel/preset-typescript', { isTSX: true, allExtensions: true }]
      ]
    }

    if (options.filename) {
      transformSync(fileContent, options)
    }

    return true
  } catch (error) {
    console.log(error)
    return false
  }
}

function _sanitizeFile(file: string): string {
  return file.replace(/\\|`|\$|"/g, '\\$&')
}
