import { Arguments } from 'yargs'

import { kebabCase } from '../../../../lib/changeCase'
import inputPromptWithOptions from '../../../../lib/prompts/inputPromptWithOptions'
import feComponentTypePrompt from '../../../../lib/prompts/webapp/feComponentTypePrompt'
import fePagePrompt from '../../../../lib/prompts/webapp/fePagePrompt'
import feRootPathPrompt from '../../../../lib/prompts/webapp/feRootPathPrompt'
import ynSelectPrompt from '../../../../lib/prompts/ynSelectPrompt'

import { CreatePageParams } from './TYPES'

export default async function getParams(
  argv: Arguments
): Promise<CreatePageParams> {
  const { srcFolderPath } = await feRootPathPrompt(argv.projectRoot as string)
  const { pageName, pagePath } = await fePagePrompt(
    srcFolderPath,
    argv.reducerName as string,
    true
  )

  const pageRoutePath = await inputPromptWithOptions(
    'Page Route Path',
    [`/${kebabCase(pageName)}`],
    argv.pageRoutePath as string
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

  const params: CreatePageParams = {
    srcFolderPath,
    pageName,
    pagePath,
    pageRoutePath,
    componentType,
    state,
    redux,
    router
  }

  return params
}
