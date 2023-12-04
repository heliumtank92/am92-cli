const COMP_REDUX_ROUTER = `import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { DsTypography } from '@am92/react-design-system'
import withRouter, { IWithRouterProps } from '~/src/Hocs/withRouter'

export interface I{componentName}Props extends IWithRouterProps {
  actions: {}
}

class {componentName} extends PureComponent<I{componentName}Props> {
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

export default COMP_REDUX_ROUTER
