export default function builder(yargs: any): any {
  return yargs
    .option('rsrc-name', {
      description: 'Resource Name',
      type: 'string',
      required: false
    })
    .option('api-folder-path', {
      description: 'API Folder Path',
      type: 'string',
      required: false
    })
    .option('router-mount-path', {
      description: 'Router Mount Path',
      type: 'string',
      required: false
    })
}
