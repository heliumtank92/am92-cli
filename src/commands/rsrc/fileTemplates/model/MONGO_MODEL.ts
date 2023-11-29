const MONGO_MODEL = `import { Model } from '@am92/mongo-odm'
import {rsrcName}Schema from './{rsrcName}.Schema.mjs'

const {rsrcName}Odm = new Model('{rsrcName}', {rsrcName}Schema)

const {rsrcName}Model = {}

export default {rsrcName}Model`

export default MONGO_MODEL
