import CliCommand from '../../../../../lib/CliCommand'
import INDEX_FILE from '../crudFiles/INDEX_FILE'

export default function createIndex(rsrcName: string, rsrcPath: string) {
  // Create Resource Index
  const index = INDEX_FILE.replaceAll('{rsrcName}', rsrcName)
  const rsrcIndexPath = `${rsrcPath}/index.mjs`
  new CliCommand('Create Resource Index', 'echo')
    .append(`"${index}"`)
    .append(`> ${rsrcIndexPath}`)
    .exec(false)
}
