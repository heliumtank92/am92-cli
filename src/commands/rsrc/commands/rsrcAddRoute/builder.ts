import { METHODS } from './TYPES'

export default function builder(yargs: any): any {
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
    .option('partial-name', {
      description: 'Resource Partial Name',
      type: 'string',
      required: false
    })
    .option('route-name', {
      description: 'Route Name',
      type: 'string',
      required: false
    })
    .option('route-method', {
      description: 'Route Method',
      type: 'string',
      choices: METHODS,
      required: false
    })
    .option('route-path', {
      description: 'Route Path',
      type: 'string',
      required: false
    })
    .option('has-query', {
      description: 'Does Route have query',
      type: 'string',
      choices: ['y', 'n'],
      required: false
    })
}
