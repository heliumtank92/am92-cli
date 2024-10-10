import { search } from '@inquirer/prompts'

export default async function searchPrompt(
  message: string,
  choices: string[],
  value?: string
): Promise<string> {
  if (value && choices.includes(value)) {
    return value
  }

  const searchValue = (await search({
    message: `${message}:`,
    source: async input => {
      if (!input) {
        return choices
      }

      const filteredChoices = choices.filter(choice =>
        choice.toLowerCase().includes(input.toLowerCase())
      )
      return filteredChoices
    }
  }).catch(error => {
    if (error.name === 'ExitPromptError') {
      process.exit()
    }
  })) as string

  return searchValue
}
