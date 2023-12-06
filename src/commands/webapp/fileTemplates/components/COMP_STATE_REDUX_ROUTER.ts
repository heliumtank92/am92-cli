const COMP_STATE_REDUX_ROUTER = `import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ThunkDispatch } from '@reduxjs/toolkit'
import { DsTypography } from '@am92/react-design-system'
import withRouter, { IWithRouterProps } from '~/src/Hocs/withRouter'

export interface I{componentName}Props extends IWithRouterProps {
  actions: {}
}

export interface I{componentName}State {}

class {componentName} extends Component<I{componentName}Props, I{componentName}State> {
  state = {}

  render() {
    return (
      <DsTypography>{componentName}</DsTypography>
    )
  }
}

const mapStateToProps = (state: any) => {
  return {}
}

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, any>) => ({
  actions: {}
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter({componentName}))`

export default COMP_STATE_REDUX_ROUTER
