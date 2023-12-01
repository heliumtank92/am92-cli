import yargs, { Arguments } from 'yargs'
import fs from 'fs'
import { colorify, logger } from '../../../lib/logger'
import inputReader from '../../../lib/inputReader'
import CliCommand from '../../../lib/CliCommand'
import { writeFile, rewriteFile } from '../../../lib/file'
import { constantCase } from '../../../lib/changeCase'

import PAGE_FILE from './PAGE_FILE'

const COMMAND = 'webapp-create-page'

yargs.command(
  COMMAND,
  colorify.trace('Create Page in React Webapp using Typescript'),
  builder,
  handler
)

function builder(yargs: any): any {
  return yargs
    .option('project-root', {
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

  let projectRoot = (argv.projectRoot as string) || ''
  let pageName = (argv.pageName as string) || ''
  let pagePath = (argv.pagePath as string) || ''

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
  const page = PAGE_FILE.replaceAll('{pageName}', pageName)
  const pageLoc = `${pageFolderPath}/${pageName}.Page.tsx`
  writeFile('Page File', page, pageLoc)

  const appRoutesFile = `${srcFolderPath}/Constants/APP_ROUTES.ts`
  rewriteFile(
    'Routes File',
    appRoutesFile,
    _appRoutesFileEditor(pageName, pagePath)
  )

  const appRouterFile = `${srcFolderPath}/Configurations/getAppRouter.tsx`
  rewriteFile('App Router File', appRouterFile, _appRouterEditor(pageName))

  logger.complete(`[${COMMAND}] Completed!`)
}

function _appRoutesFileEditor(pageName: string, pagePath: string) {
  return function (file: string): string {
    let currentRoutes = (file.match(/((.|\n)+)?import(.|\n)+?ANY:/gm) || [
      ''
    ])[0]

    if (!currentRoutes) {
      return file
    }

    currentRoutes = currentRoutes.replace('ANY:', '')

    const restFile = file.replace(/((.|\n)+)?import(.|\n)+?ANY:/gm, '')

    return `${currentRoutes}${constantCase(pageName)}: {
    pathname: '${pagePath}'
  },

  ANY:${restFile.substring(0, restFile.length - 1)}`
  }
}

function _appRouterEditor(pageName: string) {
  return function (file: string): string {
    let imports = (file.match(
      /((.|\n)+)?import(.|\n)+const NotFoundPage/gm
    ) || [''])[0]

    if (!imports) {
      return file
    }

    const newImports = imports.replace(
      'const NotFoundPage',
      `const ${pageName}Page = React.lazy(
  () => import('~/src/Pages/${pageName}/${pageName}.Page')
)`
    )

    const restFile = file.replace(
      /((.|\n)+)?import(.|\n)+const NotFoundPage/gm,
      ''
    )

    const newFile = `${newImports}\n\nconst NotFoundPage${restFile}`

    let currentRoutes = (newFile.match(
      /((.|\n)+)?import(.|\n)+{\n.*path: APP_ROUTES.ANY.pathname,/gm
    ) || [''])[0]

    if (!currentRoutes) {
      return file
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
}
