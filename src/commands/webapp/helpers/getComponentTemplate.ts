import COMP from '../fileTemplates/components/COMP'
import COMP_REDUX from '../fileTemplates/components/COMP_REDUX'
import COMP_REDUX_ROUTER from '../fileTemplates/components/COMP_REDUX_ROUTER'
import COMP_ROUTER from '../fileTemplates/components/COMP_ROUTER'
import COMP_STATE from '../fileTemplates/components/COMP_STATE'
import COMP_STATE_REDUX from '../fileTemplates/components/COMP_STATE_REDUX'
import COMP_STATE_REDUX_ROUTER from '../fileTemplates/components/COMP_STATE_REDUX_ROUTER'
import COMP_STATE_ROUTER from '../fileTemplates/components/COMP_STATE_ROUTER'

export default function getComponentTemplate(
  state: boolean,
  redux: boolean,
  router: boolean
): string {
  if (!state && !redux && !router) {
    return COMP
  }

  if (!state && !redux && router) {
    return COMP_ROUTER
  }

  if (!state && redux && !router) {
    return COMP_REDUX
  }

  if (!state && redux && router) {
    return COMP_REDUX_ROUTER
  }

  if (state && !redux && !router) {
    return COMP_STATE
  }

  if (state && !redux && router) {
    return COMP_STATE_ROUTER
  }

  if (state && redux && !router) {
    return COMP_STATE_REDUX
  }

  if (state && redux && router) {
    return COMP_STATE_REDUX_ROUTER
  }

  return ''
}
