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
    .option('page-path', {
      description: 'Page Path',
      type: 'string',
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
