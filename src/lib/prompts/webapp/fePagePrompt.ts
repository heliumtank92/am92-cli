import subFolderPrompt from '../subFolderPrompt'

export default async function fePagePrompt(
  srcFolderPath: string,
  pageName?: string,
  isNew?: boolean
): Promise<{
  pagesPath: string
  pageName: string
  pagePath: string
}> {
  const pagesPath = `${srcFolderPath}/Pages`
  const { subFolderName, subFolderPath } = await subFolderPrompt(
    pagesPath,
    'Page',
    pageName,
    isNew
  )

  return {
    pagesPath,
    pageName: subFolderName,
    pagePath: subFolderPath
  }
}
