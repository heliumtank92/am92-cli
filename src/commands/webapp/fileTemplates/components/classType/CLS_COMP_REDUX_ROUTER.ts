const CLS_COMP_REDUX_ROUTER = `import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { DsTypography } from '@am92/react-design-system'
import { ThunkDispatch } from '@reduxjs/toolkit'

import { TAppDispatch, TAppSore } from '~/src/Configurations/AppStore'
import withRouter, { IWithRouterProps } from '~/src/Hocs/withRouter'

export interface I{componentName}Props extends IWithRouterProps, PropsFromRedux {}

class {componentName} extends PureComponent<I{componentName}Props> {
  render() {
    return (
      <DsTypography>{componentName}</DsTypography>
    )
  }
}

const mapStateToProps = (state: TAppSore) => {
  return {}
}

const mapDispatchToProps = (dispatch: TAppDispatch) => ({
  actions: {}
})

const connector = connect(mapStateToProps, mapDispatchToProps)
type PropsFromRedux = ConnectedProps<typeof connector>

export default connector(withRouter({componentName}))`

export default CLS_COMP_REDUX_ROUTER
