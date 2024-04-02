import fs from 'fs'
import { Arguments } from 'yargs'

import inputReader from '../../../lib/inputReader'
import { logger } from '../../../lib/logger'
import { kebabCase, pascalCase } from '../../../lib/changeCase'

import { CreatePageParams } from './TYPES'
import { getWebappRootPaths } from '../../../helpers/webappInpurReader'

export default function getParams(argv: Arguments): CreatePageParams {
  const { srcFolderPath } = getWebappRootPaths(argv)
  let pageName = (argv.pageName as string) || ''
  let pagePath = (argv.pagePath as string) || ''
  let state = ((argv.state as string) || '').toLowerCase()
  let redux = ((argv.redux as string) || '').toLowerCase()
  let router = ((argv.router as string) || '').toLowerCase()

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
    pagePath = inputReader('Page Route Path', PAGE_PATH, true)
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
