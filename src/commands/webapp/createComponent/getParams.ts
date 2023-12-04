import fs from 'fs'
import { Arguments } from 'yargs'

import inputReader from '../../../lib/inputReader'
import { logger } from '../../../lib/logger'
import { pascalCase } from '../../../lib/changeCase'

import { CreateComponentParams } from './TYPES'

export default function getParams(argv: Arguments): CreateComponentParams {
  let projectRoot = (argv.projectRoot as string) || ''
  let pageName = (argv.pageName as string) || ''
  let componentName = (argv.componentName as string) || ''
  let state = ((argv.state as string) || '').toLowerCase()
  let redux = ((argv.redux as string) || '').toLowerCase()
  let router = ((argv.router as string) || '').toLowerCase()

  if (!projectRoot) {
    const ROOT_FOLDER_PATH: string = '.'
    projectRoot = inputReader('Project Root Path', ROOT_FOLDER_PATH, true)
  }

  if (!fs.existsSync(projectRoot)) {
    logger.fatal(
      `[Error] Project does not exist at the location: ${projectRoot}`
    )
    process.exit()
  }

  const srcFolderPath = `${projectRoot}/src`
  if (!fs.existsSync(srcFolderPath)) {
    logger.fatal(
      `[Error] Project Source Folder does not exist at the location: ${srcFolderPath}`
    )
    process.exit()
  }

  if (!pageName) {
    pageName = inputReader('Page Name', '', false)
    pageName = pascalCase(pageName)
  }

  let pageFolderPath = ''
  if (pageName) {
    const pagesFolderPath = `${srcFolderPath}/Pages`
    if (!fs.existsSync(pagesFolderPath)) {
      logger.fatal(
        `[Error] Pages Folder does not exist at the location: ${srcFolderPath}`
      )
      process.exit()
    }

    pageFolderPath = `${pagesFolderPath}/${pageName}`
    if (!fs.existsSync(pageFolderPath)) {
      logger.fatal(
        `[Error] Page does not exist at the location: ${pageFolderPath}`
      )
      process.exit()
    }
  }

  if (!componentName) {
    componentName = inputReader('Component Name', '', true)
    componentName = pascalCase(componentName)
  }

  if (!state) {
    state = inputReader('Component has State? [y/n]', '', false)
    state = state.toLowerCase()
  }

  if (!redux) {
    redux = inputReader('Component Connected to Redux? [y/n]', '', false)
    redux = redux.toLowerCase()
  }

  if (!router) {
    router = inputReader('Component with Router? [y/n]', '', false)
    router = router.toLowerCase()
  }

  const params: CreateComponentParams = {
    srcFolderPath,
    pageFolderPath,
    pageName,
    componentName,
    state: state === 'y',
    redux: redux === 'y',
    router: router === 'y'
  }

  return params
}
