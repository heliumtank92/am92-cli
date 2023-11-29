const ES_MODEL = `import { Model } from '@am92/opensearch-odm'
import {rsrcName}Schema from './{rsrcName}.Schema.mjs'
import { MODEL_NAME } from './{rsrcName}.Constants.mjs'

const {rsrcName}Odm = new Model('{rsrcName}', {rsrcName}Schema)

const {rsrcName}Model = {}

export default {rsrcName}Model`

export default ES_MODEL
