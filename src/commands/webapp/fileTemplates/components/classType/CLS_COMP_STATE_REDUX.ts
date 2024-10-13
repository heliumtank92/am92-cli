const CLS_COMP_STATE_REDUX = `import React, { Component } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { DsTypography } from '@am92/react-design-system'

import { TAppDispatch, TAppStore } from '~/src/Configurations/AppStore'

export interface I{componentName}Props extends PropsFromRedux {}

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

export default connector({componentName})`

export default CLS_COMP_STATE_REDUX
