import { transformSync } from '@babel/core'
import CliCommand from './CliCommand'
import { logger } from './logger'

export default function createFile(
  fileName: string,
  fileContent: string,
  filePath: string
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

  new CliCommand(`Create ${fileName}`, 'echo')
    .append(`"${fileContent}"`)
    .append(`> ${filePath}`)
    .exec(false)
}
