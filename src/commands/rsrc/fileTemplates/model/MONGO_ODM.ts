const MONGO_ODM = `import { Model } from '@am92/mongo-odm'
import {rsrcName}Schema from '../{rsrcName}.Schema/index.mjs'

const {rsrcName}Odm = new Model('{rsrcName}', {rsrcName}Schema)

export default {rsrcName}Odm`

export default MONGO_ODM
