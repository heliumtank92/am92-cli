import inputPrompt from './inputPrompt'
import selectPrompt from './selectPrompt'

export default async function inputPromptWithOptions(
  message: string,
  options: string[],
  value?: string
): Promise<string> {
  if (value) {
    return value
  }

  const selectedValue: string = await selectPrompt(message, [
    ...options,
    'Custom Value'
  ])

  if (selectedValue !== 'Custom Value') {
    return selectedValue
  }

  const inputValue: string = await inputPrompt(message)
  return inputValue
}
