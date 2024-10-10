import { Arguments } from 'yargs'

import { pascalCase } from '../../../../lib/changeCase'
import inputPrompt from '../../../../lib/prompts/inputPrompt'
import feComponentLocationPrompt from '../../../../lib/prompts/webapp/feComponentLocationPrompt'
import feComponentTypePrompt from '../../../../lib/prompts/webapp/feComponentTypePrompt'
import fePagePrompt from '../../../../lib/prompts/webapp/fePagePrompt'
import feRootPathPrompt from '../../../../lib/prompts/webapp/feRootPathPrompt'
import ynSelectPrompt from '../../../../lib/prompts/ynSelectPrompt'

import { CreateComponentParams } from './TYPES'

export default async function getParams(
  argv: Arguments
): Promise<CreateComponentParams> {
  const { srcFolderPath } = await feRootPathPrompt(argv.projectRoot as string)
  const componentLocation = await feComponentLocationPrompt(
    argv.projectRoot as string
  )

  let pageName = ''
  let pagePath = ''

  if (componentLocation === 'page') {
    const pageProps = await fePagePrompt(srcFolderPath, argv.pageName as string)
    pageName = pageProps.pageName
    pagePath = pageProps.pagePath
  }

  const componentName = pascalCase(
    await inputPrompt('Component Name', argv.componentName as string)
  )

  const componentType = await feComponentTypePrompt(
    argv.componentType as string
  )

  const state = await ynSelectPrompt('Page has State?', argv.state as string)
  const redux = await ynSelectPrompt(
    'Page Connected to Redux?',
    argv.redux as string
  )
  const router = await ynSelectPrompt(
    'Page with Router?',
    argv.router as string
  )

  const params: CreateComponentParams = {
    srcFolderPath,
    pageName,
    pagePath,
    componentName,
    componentType,
    state,
    redux,
    router
  }

  return params
}
