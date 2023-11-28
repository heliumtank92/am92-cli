import CliCommand from '../../../../../lib/CliCommand'
import API_ROUTER_FILE from '../../../create/files/API_ROUTER_FILE'

export default function createApiRouter(
  rsrcName: string,
  routesFolderPath: string
) {
  // Create API Router
  const apiRouter = API_ROUTER_FILE.replaceAll('{rsrcName}', rsrcName)
  const apiRouterPath = `${routesFolderPath}/${rsrcName}.mjs`
  new CliCommand('Create API Router', 'echo')
    .append(`"${apiRouter}"`)
    .append(`> ${apiRouterPath}`)
    .exec(false)
}
