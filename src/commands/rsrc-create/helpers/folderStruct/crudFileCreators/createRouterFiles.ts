import CliCommand from '../../../../../lib/CliCommand'
import ROUTER_CRUD_FILE from '../crudFiles/ROUTER_CRUD_FILE'
import ROUTER_INDEX_FILE from '../crudFiles/ROUTER_INDEX_FILE'

export default function createRouterFiles(rsrcName: string, rsrcPath: string) {
  // Create Resource Router Folder
  new CliCommand(
    'Create Resource Router Folder',
    `mkdir ${rsrcPath}/${rsrcName}.Router`
  ).exec(false)

  // Create Resource Router CRUD
  const routerCrud = ROUTER_CRUD_FILE.replaceAll('{rsrcName}', rsrcName)
  const routerCrudPath = `${rsrcPath}/${rsrcName}.Router/Crud.Routes.mjs`
  new CliCommand('Create Resource Router CRUD', 'echo')
    .append(`"${routerCrud}"`)
    .append(`> ${routerCrudPath}`)
    .exec(false)

  // Create Resource Router Index
  const routerIndex = ROUTER_INDEX_FILE.replaceAll('{rsrcName}', rsrcName)
  const routerIndexPath = `${rsrcPath}/${rsrcName}.Router/index.mjs`
  new CliCommand('Create Resource Router Index', 'echo')
    .append(`"${routerIndex}"`)
    .append(`> ${routerIndexPath}`)
    .exec(false)
}
