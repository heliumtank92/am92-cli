import fs from 'fs'
import { select } from '@inquirer/prompts'
import { logger } from '../logger'
import inputPrompt from './inputPrompt'
import { pascalCase } from '../changeCase'
import CliCommand from '../CliCommand'

export default async function bePartialPrompt(
  rsrcPath: string,
  rsrcName: string,
  partialName: string,
  isNew?: boolean
): Promise<string> {
  if (isNew) {
    partialName = partialName || (await inputPrompt('Resource Partial Name:'))
    partialName = pascalCase(partialName)

    const partialModelPath = `${rsrcPath}/${rsrcName}.Model/${partialName}.Model.mjs`
    if (fs.existsSync(partialModelPath)) {
      logger.fatal(
        `[Error] Resource Partial already exists at the location: ${partialModelPath}/`
      )
      process.exit()
    }

    return partialName
  }

  const rsrcModelPath = `${rsrcPath}/${rsrcName}.Model`

  const partials = new CliCommand('List Resources', `ls ${rsrcModelPath}/*`)
    .exec(false)
    .toString()
    .split('\n')
    .reduce((acc: string[], partialItem: string) => {
      partialName = partialItem
        .replace(`${rsrcModelPath}/`, '')
        .replace('.Model.mjs', '')

      if (partialName && partialName !== 'index.mjs') {
        acc.push(partialName)
      }
      return acc
    }, [])
    .sort()

  partialName =
    partialName ||
    ((await select({
      message: 'Select Resource Partial',
      choices: partials,
      default: partials[0]
    })) as string)

  partialName = pascalCase(partialName)
  return partialName
}
