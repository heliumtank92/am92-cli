import selectPrompt from '../selectPrompt'

export default async function feComponentLocationPrompt(
  componentLocation: string
): Promise<string> {
  const value = await selectPrompt(
    'Component Location',
    COMPONENT_LOCATIONS,
    componentLocation
  )

  return value
}

const COMPONENT_LOCATIONS = [
  { name: 'Page Component', value: 'page' },
  { name: 'Common Component', value: 'common' }
]
