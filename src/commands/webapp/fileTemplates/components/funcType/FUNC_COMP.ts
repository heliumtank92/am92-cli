const FUNC_COMP = `import React from 'react'
import { DsTypography } from '@am92/react-design-system'

export interface I{componentName}Props {}

const {componentName}: React.FC<I{componentName}Props> = () => {
  return (
    <DsTypography>{componentName}</DsTypography>
  )
}

export default {componentName}`

export default FUNC_COMP
