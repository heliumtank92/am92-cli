import selectPrompt from './selectPrompt'

export default async function ynSelectPrompt(
  message: string,
  value?: string
): Promise<boolean> {
  if (value) {
    return value === 'y'
  }

  const selectedValue: string = await selectPrompt(message, CHOICES, value)
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
