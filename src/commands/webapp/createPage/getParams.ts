import fs from 'fs'
import { Arguments } from 'yargs'

import inputReader from '../../../lib/inputReader'
import { logger } from '../../../lib/logger'
import { kebabCase, pascalCase } from '../../../lib/changeCase'

import { CreatePageParams } from './TYPES'

export default function getParams(argv: Arguments): CreatePageParams {
  let projectRoot = (argv.projectRoot as string) || ''
  let pageName = (argv.pageName as string) || ''
  let pagePath = (argv.pagePath as string) || ''
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

  const pagesFolderPath = `${srcFolderPath}/Pages`
  if (!fs.existsSync(pagesFolderPath)) {
    logger.fatal(
      `[Error] Pages Folder does not exist at the location: ${srcFolderPath}`
    )
    process.exit()
  }

  if (!pageName) {
    const PAGE_NAME = 'Sample'
    pageName = inputReader('Page Name', PAGE_NAME, true)
    pageName = pascalCase(pageName)
  }

  const pageFolderPath = `${pagesFolderPath}/${pageName}`
  if (fs.existsSync(pageFolderPath)) {
    logger.fatal(
      `[Error] Page already exists at the location: ${pageFolderPath}`
    )
    process.exit()
  }

  if (!pagePath) {
    const PAGE_PATH = `/${kebabCase(pageName)}`
    pagePath = inputReader('Page Path', PAGE_PATH, true)
  }

  if (!state) {
    state = inputReader('Page has State? [y/n]', '', false)
    state = state.toLowerCase()
  }

  if (!redux) {
    redux = inputReader('Page Connected to Redux? [y/n]', '', false)
    redux = redux.toLowerCase()
  }

  if (!router) {
    router = inputReader('Page with Router? [y/n]', '', false)
    router = router.toLowerCase()
  }

  const params: CreatePageParams = {
    srcFolderPath,
    pageFolderPath,
    pageName,
    pagePath,
    state: state === 'y',
    redux: redux === 'y',
    router: router === 'y'
  }

  return params
}
