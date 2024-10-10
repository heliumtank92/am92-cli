import fs from 'fs'

import { pascalCase } from '../changeCase'
import CliCommand from '../CliCommand'
import { logger } from '../logger'
import inputPrompt from './inputPrompt'
import searchPrompt from './searchPrompt'

export default async function subFolderPrompt(
  mainFolderPath: string,
  subFolderType: string,
  subFolderName?: string,
  isNew?: boolean
): Promise<{
  subFolderName: string
  subFolderPath: string
}> {
  if (!fs.existsSync(mainFolderPath)) {
    logger.fatal(
      `[Error] Folder does not exist at the location: ${mainFolderPath}`
    )
    process.exit()
  }

  if (isNew) {
    subFolderName = await inputPrompt(`${subFolderType} Name:`, subFolderName)
    subFolderName = pascalCase(subFolderName)

    const subFolderPath = `${mainFolderPath}/${subFolderName}`
    if (fs.existsSync(subFolderPath)) {
      logger.fatal(
        `[Error] ${subFolderType} already exists at the location: ${subFolderPath}`
      )
      process.exit()
    }

    return { subFolderName, subFolderPath }
  }

  const subFolders: string[] = new CliCommand(
    `List ${subFolderType}`,
    `ls -d ${mainFolderPath}/*`
  )
    .exec(false)
    .toString()
    .split('\n')
    .reduce((acc: string[], subFolderPath: string) => {
      const subFolderName = subFolderPath.replace(`${mainFolderPath}/`, '')
      if (subFolderName) {
        const isDir = fs.lstatSync(subFolderPath).isDirectory()
        if (isDir) {
          acc.push(subFolderName)
        }
      }
      return acc
    }, [])
    .sort()

  subFolderName = await searchPrompt(
    `Select ${subFolderType}`,
    subFolders,
    subFolderName
  )

  const subFolderPath = `${mainFolderPath}/${subFolderName}`

  return { subFolderName, subFolderPath }
}
