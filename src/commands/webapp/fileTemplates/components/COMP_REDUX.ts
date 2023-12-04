const COMP_REDUX = `import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { DsTypography } from '@am92/react-design-system'

export interface I{componentName}Props {
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

export default connect(mapStateToProps, mapDispatchToProps)({componentName})`

export default COMP_REDUX
