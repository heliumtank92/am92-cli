import CliCommand from '../../../../../lib/CliCommand'
import CONTROLLER_CRUD_FILE from '../crudFiles/CONTROLLER_CRUD_FILE'
import CONTROLLER_INDEX_FILE from '../crudFiles/CONTROLLER_INDEX_FILE'

export default function createControllerFiles(
  rsrcName: string,
  rsrcPath: string
) {
  // Create Resource Controller Folder
  new CliCommand(
    'Create Resource Controller Folder',
    `mkdir ${rsrcPath}/${rsrcName}.Controller`
  ).exec(false)

  // Create Resource Controller CRUD
  const controllerCrud = CONTROLLER_CRUD_FILE.replaceAll('{rsrcName}', rsrcName)
  const controllerCrudPath = `${rsrcPath}/${rsrcName}.Controller/Crud.Controller.mjs`
  new CliCommand('Create Resource Controller CRUD', 'echo')
    .append(`"${controllerCrud}"`)
    .append(`> ${controllerCrudPath}`)
    .exec(false)

  // Create Resource Controller Index
  const controllerIndex = CONTROLLER_INDEX_FILE.replaceAll(
    '{rsrcName}',
    rsrcName
  )
  const controllerIndexPath = `${rsrcPath}/${rsrcName}.Controller/index.mjs`
  new CliCommand('Create Resource Controller Index', 'echo')
    .append(`"${controllerIndex}"`)
    .append(`> ${controllerIndexPath}`)
    .exec(false)
}
