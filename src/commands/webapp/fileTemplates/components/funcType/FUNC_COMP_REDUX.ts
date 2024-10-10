const FUNC_COMP_REDUX = `import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { DsTypography } from '@am92/react-design-system'

import { TAppDispatch, TAppSore } from '~/src/Configurations/AppStore'

export interface I{componentName}Props extends PropsFromRedux {}

const {componentName}: React.FC<I{componentName}Props> = () => {
  return (
    <DsTypography>{componentName}</DsTypography>
  )
}

const mapStateToProps = (state: TAppSore) => {
  return {}
}

const mapDispatchToProps = (dispatch: TAppDispatch) => ({
  actions: {}
})

const connector = connect(mapStateToProps, mapDispatchToProps)
type PropsFromRedux = ConnectedProps<typeof connector>

export default connector({componentName})`

export default FUNC_COMP_REDUX
