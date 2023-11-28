const MODEL_ODM_FILE = `import { Model } from '@am92/opensearch-odm'
import {rsrcName}Schema from '../{rsrcName}.Schema.mjs'
import { MODEL_NAME } from '../{rsrcName}.Constants.mjs'

const {rsrcName}Odm = new Model(MODEL_NAME, {rsrcName}Schema)

export default {rsrcName}Odm`

export default MODEL_ODM_FILE
