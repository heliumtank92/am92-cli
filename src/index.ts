#! /usr/bin/env node
import yargs from 'yargs'
import './commands/feStack'
import './commands/rsrc'
import './commands/webapp'

yargs.help(true).wrap(100).argv
