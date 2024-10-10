import subFolderPrompt from '../subFolderPrompt'

export default async function feReducerPrompt(
  srcFolderPath: string,
  reducerName?: string,
  isNew?: boolean
): Promise<{
  reduxPath: string
  reducerName: string
  reducerPath: string
}> {
  const reduxPath = `${srcFolderPath}/Redux`
  const { subFolderName, subFolderPath } = await subFolderPrompt(
    reduxPath,
    'Reducer',
    reducerName,
    isNew
  )

  return {
    reduxPath,
    reducerName: subFolderName,
    reducerPath: subFolderPath
  }
}
