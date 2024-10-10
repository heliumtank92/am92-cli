import { select } from '@inquirer/prompts'

export default async function selectPrompt(
  message: string,
  choices: string[] | Array<{ name: string; value: string }>,
  value?: string,
  defaultChoice?: string
): Promise<string> {
  if (
    value &&
    choices.some(choice => {
      if (typeof choice === 'string') {
        return choice === value
      } else {
        return choice.value === value
      }
    })
  ) {
    return value
  }

  const selectValue = (await select({
    message: `${message}:`,
    choices,
    default: defaultChoice
  }).catch(error => {
    if (error.name === 'ExitPromptError') {
      process.exit()
    }
  })) as string

  return selectValue
}
