import CliCommand from '../../../../../lib/CliCommand'
import CONTROLLER_FILE from '../crudFiles/CONTROLLER_FILE'

export default function createController(rsrcName: string, rsrcPath: string) {
  // Create Resource Controller
  const controller = CONTROLLER_FILE.replaceAll('{rsrcName}', rsrcName)
  const controllerPath = `${rsrcPath}/${rsrcName}.Controller.mjs`
  new CliCommand('Create Resource Controller', 'echo')
    .append(`"${controller}"`)
    .append(`> ${controllerPath}`)
    .exec(false)
}
