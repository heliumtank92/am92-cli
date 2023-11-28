import CliCommand from '../../../../../lib/CliCommand'
import MODEL_CRUD_FILE from '../crudFiles/MODEL_CRUD_FILE'
import MODEL_INDEX_FILE from '../crudFiles/MODEL_INDEX_FILE'

export default function createModelFiles(rsrcName: string, rsrcPath: string) {
  // Create Resource Model CRUD
  const modelCrud = MODEL_CRUD_FILE.replaceAll('{rsrcName}', rsrcName)
  const modelCrudPath = `${rsrcPath}/${rsrcName}.Model/Crud.Model.mjs`
  new CliCommand('Create Resource Model CRUD', 'echo')
    .append(`"${modelCrud}"`)
    .append(`> ${modelCrudPath}`)
    .exec(false)

  // Create Resource Model Index
  const modelIndex = MODEL_INDEX_FILE.replaceAll('{rsrcName}', rsrcName)
  const modelIndexPath = `${rsrcPath}/${rsrcName}.Model/index.mjs`
  new CliCommand('Create Resource Model Index', 'echo')
    .append(`"${modelIndex}"`)
    .append(`> ${modelIndexPath}`)
    .exec(false)
}
