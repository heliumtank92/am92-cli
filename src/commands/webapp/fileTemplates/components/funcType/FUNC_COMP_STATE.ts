const FUNC_COMP_STATE = `import React, { useState } from 'react'
import { DsTypography } from '@am92/react-design-system'

export interface I{componentName}Props {}

const {componentName}: React.FC<I{componentName}Props> = () => {
  const [value, setValue] = useState<string>('')

  return (
    <DsTypography onClick={() => setValue('{componentName}')}>
      {componentName} State Value: {value}
    </DsTypography>
  )
}

export default {componentName}`

export default FUNC_COMP_STATE
