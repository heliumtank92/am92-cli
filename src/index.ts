#! /usr/bin/env node
import './commands/setup'
import './commands/be'
import './commands/rsrc'
import './commands/webapp'
import './commands/feStack'

import yargs from 'yargs'

yargs
  .completion()
  .scriptName('am92')
  .help(true)
  .alias('help', 'h')
  .alias('version', 'v')
  .wrap(100).argv
