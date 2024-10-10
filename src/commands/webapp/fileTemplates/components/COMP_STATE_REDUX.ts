const COMP_STATE_REDUX = `import React, { Component } from 'react'
import { connect } from 'react-redux'
import { DsTypography } from '@am92/react-design-system'

export interface I{componentName}Props {
  actions: {}
}

export interface I{componentName}State {}

const DEFAULT_STATE: I{componentName}State = {}

class {componentName} extends Component<I{componentName}Props, I{componentName}State> {
  state = DEFAULT_STATE

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

export default connect(mapStateToProps, mapDispatchToProps)({componentName})`

export default COMP_STATE_REDUX
