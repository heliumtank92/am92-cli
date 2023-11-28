import CliCommand from '../../../../../lib/CliCommand'
import ROUTER_FILE from '../crudFiles/ROUTER_FILE'

export default function createRouter(rsrcName: string, rsrcPath: string) {
  // Create Resource Router
  const router = ROUTER_FILE.replaceAll('{rsrcName}', rsrcName)
  const routerPath = `${rsrcPath}/${rsrcName}.Router.mjs`
  new CliCommand('Create Resource Router', 'echo')
    .append(`"${router}"`)
    .append(`> ${routerPath}`)
    .exec(false)
}
