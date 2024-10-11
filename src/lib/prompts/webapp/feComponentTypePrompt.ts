import selectPrompt from '../selectPrompt'

export default async function feComponentTypePrompt(
  componentType: string
): Promise<string> {
  const value = await selectPrompt(
    'Component Type',
    COMPONENT_TYPES,
    componentType
  )

  return value
}

const COMPONENT_TYPES = [
  { name: 'Class Component', value: 'class' },
  { name: 'Functional Component', value: 'functional' }
]
