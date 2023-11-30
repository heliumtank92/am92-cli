import { transformSync } from '@babel/core'
import CliCommand from './CliCommand'
import { logger } from './logger'

export default function writeFile(
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
