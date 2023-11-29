const ES_ODM = `import { Model } from '@am92/opensearch-odm'
import {rsrcName}Schema from '../{rsrcName}.Schema/index.mjs'
import { MODEL_NAME } from '../{rsrcName}.Constants/index.mjs'

const {rsrcName}Odm = new Model(MODEL_NAME, {rsrcName}Schema)

export default {rsrcName}Odm`

export default ES_ODM
