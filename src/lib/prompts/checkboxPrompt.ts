import { checkbox } from '@inquirer/prompts'

export default async function checkboxPrompt(
  message: string,
  choices: string[] | Array<{ name: string; value: string }>,
  values?: string[]
): Promise<string[]> {
  if (values && values.length) {
    return values
  }

  const checkboxValues = (await checkbox({
    message: `${message}:`,
    choices
  }).catch(error => {
    if (error.name === 'ExitPromptError') {
      process.exit()
    }
  })) as string[]

  return checkboxValues
}
