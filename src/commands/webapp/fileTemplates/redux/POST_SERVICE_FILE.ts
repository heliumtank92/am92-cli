const POST_SERVICE_FILE = `import { WebHttpRequestOptions } from '@am92/web-http'
import { asHttp } from '~/src/Configurations/WebHttp'
import serviceActionCreatorWithTokenRotation from '~/src/Redux/serviceActionCreatorWithTokenRotation'
import { {serviceName}TraceActions, {serviceName}ServiceName } from '../Actions'

export interface I{pascalCase(serviceName)}RequestData {}

async function {serviceName}(reqData: I{pascalCase(serviceName)}RequestData) {
  const options: WebHttpRequestOptions = {
    url: \`{serviceUrl}\`,
    method: '{serviceMethod}',
    data: reqData
  }

  const response = await asHttp.request(options)
  const { data: body } = response
  const { data } = body
  return data
}

const {serviceName}Service = serviceActionCreatorWithTokenRotation(
  {serviceName}TraceActions,
  {serviceName}
)

export default {serviceName}Service
export { {serviceName}ServiceName }`

export default POST_SERVICE_FILE
