import { input } from '@inquirer/prompts'

export default async function inputPrompt(
  message: string,
  value?: string
): Promise<string> {
  if (value) {
    return value
  }

  const inputValue = (await input({ message: `${message}:` }).catch(error => {
    if (error.name === 'ExitPromptError') {
      process.exit()
    }
  })) as string

  if (!inputValue) {
    return inputPrompt(message, value)
  }
  return inputValue
}
