const MODEL_ODM_FILE = `import { Model } from '@am92/mongo-odm'
import {rsrcName}Schema from '../{rsrcName}.Schema.mjs'

const {rsrcName}Odm = new Model('{rsrcName}', {rsrcName}Schema)

export default {rsrcName}Odm`

export default MODEL_ODM_FILE
