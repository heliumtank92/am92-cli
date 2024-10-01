import { select } from '@inquirer/prompts'

export default async function selectPrompt(
  message: string,
  choices: string[] | Array<{ name: string; value: string }>,
  value?: string,
  defaultChoice?: string
): Promise<string> {
  if (value) {
    return value
  }

  const selectValue: string = await select({
    message,
    choices,
    default: defaultChoice
  })
  return selectValue
}
