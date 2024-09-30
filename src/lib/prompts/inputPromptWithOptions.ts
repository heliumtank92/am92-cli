import { input, select } from '@inquirer/prompts'

export default async function inputPromptWithOptions(
  message: string,
  options: string[],
  value?: string
): Promise<string> {
  if (value) {
    return value
  }

  const selectedValue: string = await select({
    message,
    choices: [...options, 'Custom Value']
  })

  if (selectedValue !== 'Custom Value') {
    return selectedValue
  }

  const inputValue: string = await input({ message })
  return inputValue
}
