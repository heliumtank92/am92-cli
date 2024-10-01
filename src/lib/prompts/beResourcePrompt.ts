import fs from 'fs'
import { select } from '@inquirer/prompts'
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

  const resources = new CliCommand(
    'List Resources',
    `ls -d ${rsrcFolderPath}/*`
  )
    .exec(false)
    .toString()
    .split('\n')
    .reduce((acc: string[], rsrcPath: string) => {
      const rsrcName = rsrcPath.split(`${rsrcFolderPath}/`).pop()
      if (rsrcName) {
        acc.push(rsrcName)
      }
      return acc
    }, [])
    .sort()

  rsrcName =
    rsrcName ||
    ((await select({
      message: 'Select Resource',
      choices: resources,
      default: resources[0]
    })) as string)

  const rsrcPath = `${rsrcFolderPath}/${rsrcName}`

  return { rsrcFolderPath, rsrcName, rsrcPath }
}
