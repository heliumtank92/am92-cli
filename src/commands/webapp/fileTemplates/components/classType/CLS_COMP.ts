const CLS_COMP = `import React, { PureComponent } from 'react'
import { DsTypography } from '@am92/react-design-system'

export interface I{componentName}Props {}

export default class {componentName} extends PureComponent<I{componentName}Props> {
  render() {
    return (
      <DsTypography>{componentName}</DsTypography>
    )
  }
}`

export default CLS_COMP
