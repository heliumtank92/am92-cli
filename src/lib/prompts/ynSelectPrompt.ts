import { select } from '@inquirer/prompts'

export default async function ynSelectPrompt(
  message: string,
  value?: string
): Promise<boolean> {
  if (value) {
    return value === 'y'
  }

  const selectedValue: string = await select({
    message,
    choices: CHOICES
  })

  return selectedValue === 'y'
}

const CHOICES = [
  {
    name: 'No',
    value: 'n'
  },
  {
    name: 'Yes',
    value: 'y'
  }
]
