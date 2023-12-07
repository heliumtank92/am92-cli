import promptSync, { Config } from 'prompt-sync'
import { colorify, logger } from './logger'

const promptConfig: Config = { sigint: true, eot: true }
const prompt = promptSync(promptConfig)

export default function inputReader(
  inputName: string,
  defaultValue: string,
  required?: boolean
): string {
  const inputMsg = `[Input] ${inputName}${
    defaultValue ? ` (Default: ${defaultValue}): ` : ': '
  }`

  const promptMsg = colorify.trace(inputMsg)
  const promptValue = prompt(promptMsg).trim() || defaultValue || ''

  if (required && !promptValue) {
    logger.error(`[Error] ${inputName} is mandatory!`)
    process.exit()
  }

  return promptValue
}
