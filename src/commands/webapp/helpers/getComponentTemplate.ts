import CLS_COMP from '../fileTemplates/components/classType/CLS_COMP'
import CLS_COMP_REDUX from '../fileTemplates/components/classType/CLS_COMP_REDUX'
import CLS_COMP_REDUX_ROUTER from '../fileTemplates/components/classType/CLS_COMP_REDUX_ROUTER'
import CLS_COMP_ROUTER from '../fileTemplates/components/classType/CLS_COMP_ROUTER'
import CLS_COMP_STATE from '../fileTemplates/components/classType/CLS_COMP_STATE'
import CLS_COMP_STATE_REDUX from '../fileTemplates/components/classType/CLS_COMP_STATE_REDUX'
import CLS_COMP_STATE_REDUX_ROUTER from '../fileTemplates/components/classType/CLS_COMP_STATE_REDUX_ROUTER'
import CLS_COMP_STATE_ROUTER from '../fileTemplates/components/classType/CLS_COMP_STATE_ROUTER'
import FUNC_COMP from '../fileTemplates/components/funcType/FUNC_COMP'
import FUNC_COMP_REDUX from '../fileTemplates/components/funcType/FUNC_COMP_REDUX'
import FUNC_COMP_REDUX_ROUTER from '../fileTemplates/components/funcType/FUNC_COMP_REDUX_ROUTER'
import FUNC_COMP_ROUTER from '../fileTemplates/components/funcType/FUNC_COMP_ROUTER'
import FUNC_COMP_STATE from '../fileTemplates/components/funcType/FUNC_COMP_STATE'
import FUNC_COMP_STATE_REDUX from '../fileTemplates/components/funcType/FUNC_COMP_STATE_REDUX'
import FUNC_COMP_STATE_REDUX_ROUTER from '../fileTemplates/components/funcType/FUNC_COMP_STATE_REDUX_ROUTER'
import FUNC_COMP_STATE_ROUTER from '../fileTemplates/components/funcType/FUNC_COMP_STATE_ROUTER'

export default function getComponentTemplate(
  componentType: string,
  state: boolean,
  redux: boolean,
  router: boolean
): string {
  if (componentType === 'class') {
    if (!state && !redux && !router) {
      return CLS_COMP
    }

    if (!state && !redux && router) {
      return CLS_COMP_ROUTER
    }

    if (!state && redux && !router) {
      return CLS_COMP_REDUX
    }

    if (!state && redux && router) {
      return CLS_COMP_REDUX_ROUTER
    }

    if (state && !redux && !router) {
      return CLS_COMP_STATE
    }

    if (state && !redux && router) {
      return CLS_COMP_STATE_ROUTER
    }

    if (state && redux && !router) {
      return CLS_COMP_STATE_REDUX
    }

    if (state && redux && router) {
      return CLS_COMP_STATE_REDUX_ROUTER
    }
  }

  if (componentType === 'functional') {
    if (!state && !redux && !router) {
      return FUNC_COMP
    }

    if (!state && !redux && router) {
      return FUNC_COMP_ROUTER
    }

    if (!state && redux && !router) {
      return FUNC_COMP_REDUX
    }

    if (!state && redux && router) {
      return FUNC_COMP_REDUX_ROUTER
    }

    if (state && !redux && !router) {
      return FUNC_COMP_STATE
    }

    if (state && !redux && router) {
      return FUNC_COMP_STATE_ROUTER
    }

    if (state && redux && !router) {
      return FUNC_COMP_STATE_REDUX
    }

    if (state && redux && router) {
      return FUNC_COMP_STATE_REDUX_ROUTER
    }
  }

  return ''
}
