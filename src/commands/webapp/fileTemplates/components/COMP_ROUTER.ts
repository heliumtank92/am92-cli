const COMP_ROUTER = `import React, { PureComponent } from 'react'
import { DsTypography } from '@am92/react-design-system'
import withRouter, { IWithRouterProps } from '~/src/Hocs/withRouter'

export interface I{componentName}Props extends IWithRouterProps {}

class {componentName} extends PureComponent<I{componentName}Props> {
  render() {
    return (
      <DsTypography variant='headingBoldExtraLarge'>{componentName}</DsTypography>
    )
  }
}

export default withRouter({componentName})`

export default COMP_ROUTER