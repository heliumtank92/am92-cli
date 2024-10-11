const FUNC_COMP_STATE_ROUTER = `import React, { useState } from 'react'
import { DsTypography } from '@am92/react-design-system'

import withRouter, { IWithRouterProps } from '~/src/Hocs/withRouter'

export interface I{componentName}Props extends IWithRouterProps {}

const {componentName}: React.FC<I{componentName}Props> = () => {
  const [value, setValue] = useState<string>('')

  return (
    <DsTypography onClick={() => setValue('{componentName}')}>
      {componentName} State Value: {value}
    </DsTypography>
  )
}

export default withRouter({componentName})`

export default FUNC_COMP_STATE_ROUTER
