#! /usr/bin/env node
import yargs from 'yargs'
import './commands/feStack'
import './commands/rsrc'

yargs.help(true).wrap(100).argv
