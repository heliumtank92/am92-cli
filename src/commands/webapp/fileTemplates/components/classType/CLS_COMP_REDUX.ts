const CLS_COMP_REDUX = `import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { ThunkDispatch } from '@reduxjs/toolkit'
import { DsTypography } from '@am92/react-design-system'

import { TAppDispatch, TAppStore } from '~/src/Configurations/AppStore'

export interface I{componentName}Props extends PropsFromRedux {}

class {componentName} extends PureComponent<I{componentName}Props> {
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

export default CLS_COMP_REDUX
