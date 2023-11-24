import promptSync from 'prompt-sync'
import { colorify, logger } from './logger'

const prompt = promptSync()

export default function inputReader(
  inputName: string,
  defaultValue: string,
  required?: boolean
): string {
  const inputMsg = `[Input] ${inputName}${
    defaultValue ? ` (${defaultValue}): ` : ': '
  }`

  const promptMsg = colorify.trace(inputMsg)
  const promptValue = prompt(promptMsg).trim() || defaultValue || ''

  if (required && !promptValue) {
    logger.error(`[Error] ${inputName} is mandatory!`)
    process.exit()
  }

  return promptValue
}
