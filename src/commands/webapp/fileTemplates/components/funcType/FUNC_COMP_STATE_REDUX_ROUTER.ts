const FUNC_COMP_STATE_REDUX_ROUTER = `import React, { useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { DsTypography } from '@am92/react-design-system'

import withRouter, { IWithRouterProps } from '~/src/Hocs/withRouter'
import { TAppDispatch, TAppStore } from '~/src/Configurations/AppStore'

export interface I{componentName}Props extends IWithRouterProps, PropsFromRedux {}

const {componentName}: React.FC<I{componentName}Props> = () => {
  const [value, setValue] = useState<string>('')

  return (
    <DsTypography onClick={() => setValue('{componentName}')}>
      {componentName} State Value: {value}
    </DsTypography>
  )
}

const mapStateToProps = (state: TAppStore) => {
  return {}
}

const mapDispatchToProps = (dispatch: TAppDispatch) => ({
  actions: {}
})

const connector = connect(mapStateToProps, mapDispatchToProps)
type PropsFromRedux = ConnectedProps<typeof connector>

export default connector(withRouter({componentName}))`

export default FUNC_COMP_STATE_REDUX_ROUTER
