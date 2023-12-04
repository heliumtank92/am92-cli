const COMP_STATE = `import React, { Component } from 'react'
import { DsTypography } from '@am92/react-design-system'

export interface I{componentName}Props {}

export interface I{componentName}State {}

export default class {componentName} extends Component<I{componentName}Props, I{componentName}State> {
  state = {}

  render() {
    return (
      <DsTypography>{componentName}</DsTypography>
    )
  }
}`

export default COMP_STATE
