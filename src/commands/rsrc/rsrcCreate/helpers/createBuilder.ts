export default function createBuilder(yargs: any): any {
  return yargs
    .option('project-root', {
      description: 'Project Root Path',
      type: 'string',
      required: false
    })
    .option('rsrc-name', {
      description: 'Resource Name',
      type: 'string',
      required: false
    })
    .option('router-mount-path', {
      description: 'Router Mount Path',
      type: 'string',
      required: false
    })
    .option('folder-struct', {
      description: 'Is Resouce in Folder Structure',
      type: 'string',
      choices: ['y', 'n'],
      required: false
    })
}
