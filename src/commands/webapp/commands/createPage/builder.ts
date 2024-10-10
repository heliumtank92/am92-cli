export default function builder(yargs: any): any {
  return yargs
    .option('project-root', {
      description: 'Project Root Path',
      type: 'string',
      required: false
    })
    .option('page-name', {
      description: 'Page Name',
      type: 'string',
      required: false
    })
    .option('page-route-path', {
      description: 'Page Route Path',
      type: 'string',
      required: false
    })
    .option('component-type', {
      description: 'Component Type',
      type: 'string',
      choices: ['class', 'functional'],
      required: false
    })
    .option('state', {
      description: 'Has State?',
      type: 'string',
      choices: ['y', 'n'],
      required: false
    })
    .option('redux', {
      description: 'Redux Connected?',
      type: 'string',
      choices: ['y', 'n'],
      required: false
    })
    .option('router', {
      description: 'With Router?',
      type: 'string',
      choices: ['y', 'n'],
      required: false
    })
}
