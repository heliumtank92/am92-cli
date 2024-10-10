const CLS_COMP_STATE_ROUTER = `import React, { Component } from 'react'
import { DsTypography } from '@am92/react-design-system'
import withRouter, { IWithRouterProps } from '~/src/Hocs/withRouter'

export interface I{componentName}Props extends IWithRouterProps {}

interface I{componentName}State {}

const DEFAULT_STATE: I{componentName}State = {}

class {componentName} extends Component<I{componentName}Props, I{componentName}State> {
  state = DEFAULT_STATE

  render() {
    return (
      <DsTypography>{componentName}</DsTypography>
    )
  }
}

export default withRouter({componentName})`

export default CLS_COMP_STATE_ROUTER
