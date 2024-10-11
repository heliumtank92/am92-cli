const FUNC_COMP_ROUTER = `import React from 'react'
import { DsTypography } from '@am92/react-design-system'

import withRouter, { IWithRouterProps } from '~/src/Hocs/withRouter'

export interface I{componentName}Props extends IWithRouterProps {}

const {componentName}: React.FC<I{componentName}Props> = () => {
  return (
    <DsTypography>{componentName}</DsTypography>
  )
}

export default {componentName}`

export default FUNC_COMP_ROUTER
