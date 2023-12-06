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

  try {
    const options: TransformOptions = { filename: filePath }

    if (filePath.match(/.ts$/gm)) {
      options.presets = [['@babel/preset-typescript', { allExtensions: true }]]
    } else if (filePath.match(/.tsx$/gm)) {
      options.presets = [
        ['@babel/preset-typescript', { isTSX: true, allExtensions: true }]
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
    const options: TransformOptions = { filename: filePath }

    if (filePath.match(/.ts$/gm)) {
      options.presets = [['@babel/preset-typescript', { allExtensions: true }]]
    } else if (filePath.match(/.tsx$/gm)) {
      options.presets = [
        ['@babel/preset-typescript', { isTSX: true, allExtensions: true }]
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
