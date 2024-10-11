#! /usr/bin/env node
import './commands/setup'
import './commands/be'
import './commands/rsrc'
import './commands/webapp'
import './commands/feStack'

import yargs from 'yargs'

import { colorify } from './lib/logger'

yargs
  .completion(
    'completion',
    colorify.trace('Generate Auto-complete Bash/ZSH Script')
  )
  .scriptName('am92')
  .help(true)
  .alias('help', 'h')
  .alias('version', 'v')
  .wrap(100).argv
