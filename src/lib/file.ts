import fs from 'fs'
import { transformSync } from '@babel/core'
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
  try {
    const options: any = {}

    if (filePath.match(/.ts$/gm)) {
      options.plugins = ['@babel/plugin-transform-typescript']
    } else if (filePath.match(/.tsx$/gm)) {
      options.plugins = [
        ['@babel/plugin-transform-typescript', { isTSX: true }]
      ]
    }

    transformSync(fileContent, options)
  } catch (error) {
    logger.error(`[Error] Failed to write file: ${filePath}`)
    return
  }

  new CliCommand(`${append ? 'Append' : 'Create'} ${fileName}`, 'echo')
    .append(`"${fileContent}"`)
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
