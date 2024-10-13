const CLS_COMP_STATE_REDUX_ROUTER = `import React, { Component } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { ThunkDispatch } from '@reduxjs/toolkit'
import { DsTypography } from '@am92/react-design-system'

import { TAppDispatch, TAppStore } from '~/src/Configurations/AppStore'
import withRouter, { IWithRouterProps } from '~/src/Hocs/withRouter'

export interface I{componentName}Props extends IWithRouterProps, PropsFromRedux {}

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

const mapStateToProps = (state: TAppStore) => {
  return {}
}

const mapDispatchToProps = (dispatch: TAppDispatch) => ({
  actions: {}
})

const connector = connect(mapStateToProps, mapDispatchToProps)
type PropsFromRedux = ConnectedProps<typeof connector>

export default connector(withRouter({componentName}))`

export default CLS_COMP_STATE_REDUX_ROUTER
