import { input } from '@inquirer/prompts'

export default async function inputPrompt(
  message: string,
  value?: string
): Promise<string> {
  if (value) {
    return value
  }

  const inputValue: string = await input({ message })
  if (!inputValue) {
    return inputPrompt(message, value)
  }
  return inputValue
}
