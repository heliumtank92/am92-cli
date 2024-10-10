import subFolderPrompt from '../subFolderPrompt'

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
  const { subFolderName, subFolderPath } = await subFolderPrompt(
    rsrcFolderPath,
    'Resource',
    rsrcName,
    isNew
  )

  return { rsrcFolderPath, rsrcName: subFolderName, rsrcPath: subFolderPath }
}
