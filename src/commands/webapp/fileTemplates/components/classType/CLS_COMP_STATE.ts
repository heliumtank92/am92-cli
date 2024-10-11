const CLS_COMP_STATE = `import React, { Component } from 'react'
import { DsTypography } from '@am92/react-design-system'

export interface I{componentName}Props {}

interface I{componentName}State {}

const DEFAULT_STATE: I{componentName}State = {}

export default class {componentName} extends Component<I{componentName}Props, I{componentName}State> {
  state = DEFAULT_STATE

  render() {
    return (
      <DsTypography>{componentName}</DsTypography>
    )
  }
}`

export default CLS_COMP_STATE
