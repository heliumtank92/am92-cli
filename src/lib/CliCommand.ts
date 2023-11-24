import { execSync } from 'child_process'
import { logger } from './logger'

export default class CliCommand {
  name: string
  command: string

  constructor(name: string, command: string) {
    this.name = name
    this.command = command
  }

  append = (args: string) => {
    this.command += ` ${args}`
    return this
  }

  appendArgs = (argsName: string, argsValue?: string) => {
    this.command += ` --${argsName}`
    if (argsValue !== undefined) {
      this.command += ` '${argsValue}'`
    }
    return this
  }

  exec = (shouldLog: boolean = true): any => {
    const { name, command } = this
    shouldLog && logger.trace(`[Process] ${name} In Progress...`)
    const response = _execSync(command)
    shouldLog && logger.success(`[Process] ${name} Successful!`)
    return response
  }

  toString = () => this.command
}

function _execSync(command: string): any {
  try {
    return execSync(command, { stdio: 'pipe' })
  } catch (error: any) {
    const msgArray = error.message.split(command)
    const msg = (msgArray[1] || msgArray[0] || '').trim()

    logger.fatal(`[Error] ${msg}`)
    process.exit()
  }
}
