import fs from 'fs'
import { search } from '@inquirer/prompts'
import { logger } from '../logger'
import inputPrompt from './inputPrompt'
import { pascalCase } from '../changeCase'
import CliCommand from '../CliCommand'

export default async function beResourcePrompt(
  apiFolderPath: string,
  rsrcName?: string,
  isNew?: boolean
): Promise<{
  rsrcFolderPath: string
  rsrcName: string
  rsrcPath: string
}> {
  const rsrcFolderPath = `${apiFolderPath}/resources`
  if (!fs.existsSync(rsrcFolderPath)) {
    logger.fatal(
      `[Error] Resource Folder does not exist at the location: ${apiFolderPath}/`
    )
    process.exit()
  }

  if (isNew) {
    rsrcName = rsrcName || (await inputPrompt('Resource Name:'))
    rsrcName = pascalCase(rsrcName)

    const rsrcPath = `${rsrcFolderPath}/${rsrcName}`
    if (fs.existsSync(rsrcPath)) {
      logger.fatal(
        `[Error] Resource already exists at the location: ${rsrcFolderPath}/`
      )
      process.exit()
    }

    return { rsrcFolderPath, rsrcName, rsrcPath }
  }

  const resources: string[] = new CliCommand(
    'List Resources',
    `ls -d ${rsrcFolderPath}/*`
  )
    .exec(false)
    .toString()
    .split('\n')
    .reduce((acc: string[], rsrcPath: string) => {
      const rsrcName = rsrcPath.replace(`${rsrcFolderPath}/`, '')
      if (rsrcName) {
        acc.push(rsrcName)
      }
      return acc
    }, [])
    .sort()

  rsrcName =
    rsrcName ||
    ((await search({
      message: 'Select Resource',
      source: async input => {
        if (!input) {
          return resources
        }

        const filteredResources = resources.filter(resource =>
          resource.toLowerCase().includes(input.toLowerCase())
        )
        return filteredResources
      }
    })) as string)

  const rsrcPath = `${rsrcFolderPath}/${rsrcName}`

  return { rsrcFolderPath, rsrcName, rsrcPath }
}
