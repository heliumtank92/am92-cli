import fs from 'fs'

import { pascalCase } from '../../changeCase'
import CliCommand from '../../CliCommand'
import { logger } from '../../logger'
import inputPrompt from '../inputPrompt'
import searchPrompt from '../searchPrompt'

export default async function bePartialPrompt(
  rsrcPath: string,
  rsrcName: string,
  partialName: string,
  isNew?: boolean
): Promise<string> {
  if (isNew) {
    partialName = partialName || (await inputPrompt('Resource Partial Name'))
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

  const partials: string[] = new CliCommand(
    'List Resources',
    `ls ${rsrcModelPath}/*`
  )
    .exec(false)
    .toString()
    .split('\n')
    .reduce((acc: string[], partialPath: string) => {
      partialName = partialPath
        .replace(`${rsrcModelPath}/`, '')
        .replace('.Model.mjs', '')

      if (partialName && partialPath.endsWith('.Model.mjs')) {
        acc.push(partialName)
      }
      return acc
    }, [])
    .sort()

  partialName = await searchPrompt(
    `Select Resource Partial`,
    partials,
    partialName
  )
  partialName = pascalCase(partialName)
  return partialName
}
