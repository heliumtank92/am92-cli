import yargs, { Arguments } from 'yargs'
import fs from 'fs'
import { colorify, logger } from '../../lib/logger'
import inputReader from '../../lib/inputReader'
import CliCommand from '../../lib/CliCommand'
import { getFile } from '../../lib/getFile'
import { constantCase } from '../../lib/changeCase'

const COMMAND = 'webapp-create-page'

yargs.command(
  COMMAND,
  colorify.trace('Create a Page in React Webapp using Typescript'),
  builder,
  handler
)

function builder(yargs: any): any {
  return yargs
    .option('project-root-folder-path', {
      description: 'Project Root Path',
      type: 'string',
      required: false
    })
    .option('page-name', {
      description: 'Page Name',
      type: 'string',
      required: false
    })
    .option('page-path', {
      description: 'Page Path',
      type: 'string',
      required: false
    })
}

async function handler(argv: Arguments) {
  logger.initiate(`[${COMMAND}] Initiating...`)

  let projectRootPath = (argv.projectRootPath as string) || ''
  let pageName = (argv.pageName as string) || ''
  let pagePath = (argv.pagePath as string) || ''

  if (!projectRootPath) {
    const ROOT_FOLDER_PATH: string = '.'
    projectRootPath = inputReader('Project Root Path', ROOT_FOLDER_PATH, true)
  }

  if (!fs.existsSync(projectRootPath)) {
    logger.fatal(
      `[Error] Project does not exist at the location: ${projectRootPath}`
    )
    process.exit()
  }

  const srcFolderPath = `${projectRootPath}/src`
  if (!fs.existsSync(srcFolderPath)) {
    logger.fatal(
      `[Error] Project Source Folder does not exist at the location: ${srcFolderPath}`
    )
    process.exit()
  }

  const pagesFolderPath = `${srcFolderPath}/Pages`
  if (!fs.existsSync(pagesFolderPath)) {
    logger.fatal(
      `[Error] Pages Folder does not exist at the location: ${pagesFolderPath}`
    )
    process.exit()
  }

  if (!pageName) {
    const PAGE_NAME = 'Sample'
    pageName = inputReader('Page Name', PAGE_NAME, true)
  }

  if (!pagePath) {
    const PAGE_PATH = '/sample'
    pagePath = inputReader('Page Path', PAGE_PATH, true)
  }

  const pageFolderPath = `${pagesFolderPath}/${pageName}`
  if (fs.existsSync(pageFolderPath)) {
    logger.fatal(
      `[Error] Page already exists at the location: ${pageFolderPath}`
    )
    process.exit()
  }

  // Create Page Folder
  new CliCommand('Create Page Folder', `mkdir ${pageFolderPath}`).exec(false)

  // Create Page File
  new CliCommand('Create Page File', 'echo')
    .append(pageGenerator(pageName))
    .append(`> ${pageFolderPath}/${pageName}.Page.tsx`)
    .exec(false)

  _updateAppRoutesFile(pageName, srcFolderPath, pagePath)

  _updateAppRouterFile(pageName, srcFolderPath)

  logger.complete(`[${COMMAND}] Completed!`)
}

function pageGenerator(pageName: string): string {
  return `"import React, { PureComponent } from 'react'
import { DsTypography } from '@am92/react-design-system'

export default class SamplePage extends PureComponent {
  render() {
    return (
      <DsTypography variant='headingBoldExtraLarge'>${pageName} Page</DsTypography>
    )
  }
}"`
}

function _updateAppRoutesFile(
  pageName: string,
  srcFolderPath: string,
  pagePath: string
) {
  // Read Routes File
  const APP_ROUTES_FILE = `${srcFolderPath}/Constants/APP_ROUTES.ts`
  const appRoutesFile = getFile(
    `${APP_ROUTES_FILE}`,
    `Failed to read file: ${APP_ROUTES_FILE}`,
    `Router Entry in ${APP_ROUTES_FILE} failed!`
  )

  // Build New Routes File
  const newAppRoutesFile = _buildNewAppRoutesFile(
    appRoutesFile,
    pageName,
    pagePath
  )

  // Rewrite Routes File
  new CliCommand('Rewrite Routes File', 'echo')
    .append(`"${newAppRoutesFile}"`)
    .append(`> ${APP_ROUTES_FILE}`)
    .exec(false)
}

function _buildNewAppRoutesFile(
  appRoutesFile: string,
  pageName: string,
  pagePath: string
): string {
  let currentRoutes = (appRoutesFile.match(
    /((.|\n)+)?import(.|\n)+?ANY:/gm
  ) || [''])[0]

  if (!currentRoutes) {
    return appRoutesFile
  }

  currentRoutes = currentRoutes.replace('ANY:', '')

  const restFile = appRoutesFile.replace(/((.|\n)+)?import(.|\n)+?ANY:/gm, '')

  return `${currentRoutes}${constantCase(pageName)}: {
    pathname: '${pagePath}'
  },

  ANY:${restFile.substring(0, restFile.length - 1)}`
}

function _updateAppRouterFile(pageName: string, srcFolderPath: string) {
  // Read App Router File
  const APP_ROUTER_FILE = `${srcFolderPath}/Configurations/getAppRouter.tsx`
  const appRouterFile = getFile(
    `${APP_ROUTER_FILE}`,
    `Failed to read file: ${APP_ROUTER_FILE}`,
    `Router Entry in ${APP_ROUTER_FILE} failed!`
  )

  // Build New App Router File
  const newAppRouterFile = _buildNewAppRouterFile(appRouterFile, pageName)

  // Rewrite App Router File
  new CliCommand('Rewrite App Router File', 'echo')
    .append(`"${newAppRouterFile}"`)
    .append(`> ${APP_ROUTER_FILE}`)
    .exec(false)
}

function _buildNewAppRouterFile(
  appRouterFile: string,
  pageName: string
): string {
  let imports = (appRouterFile.match(
    /((.|\n)+)?import(.|\n)+const NotFoundPage/gm
  ) || [''])[0]

  if (!imports) {
    return appRouterFile
  }

  const newImports = imports.replace(
    'const NotFoundPage',
    `const ${pageName}Page = React.lazy(
  () => import('~/src/Pages/${pageName}/${pageName}.Page')
)`
  )

  const restFile = appRouterFile.replace(
    /((.|\n)+)?import(.|\n)+const NotFoundPage/gm,
    ''
  )
  const newFile = `${newImports}
  
 const NotFoundPage${restFile}`

  let currentRoutes = (newFile.match(
    /((.|\n)+)?import(.|\n)+{\n.*path: APP_ROUTES.ANY.pathname,/gm
  ) || [''])[0]

  if (!currentRoutes) {
    return appRouterFile
  }

  currentRoutes = currentRoutes.replace(
    /{\n.*path: APP_ROUTES.ANY.pathname,/gm,
    `{
    path: APP_ROUTES.${constantCase(pageName)}.pathname,
    element: <${pageName}Page />
  } as RouteObject,`
  )

  const restNewFile = newFile.replace(
    /((.|\n)+)?import(.|\n)+{\n.*path: APP_ROUTES.ANY.pathname,/gm,
    ''
  )

  return `${currentRoutes}
  {
    path: APP_ROUTES.ANY.pathname,${restNewFile.substring(
      0,
      restFile.length - 1
    )}`
}
