#! /usr/bin/env node
import yargs from 'yargs'
import './commands/rsrc'
import './commands/webapp'
import './commands/feStack'

yargs.help(true).wrap(100).argv
