const MONGO_SCHEMA = `import { buildSchema } from '@am92/mongo-odm'

const schemaObject = {}

const schemaOptions = {}

const {rsrcName}Schema = buildSchema(schemaObject, schemaOptions)

export default {rsrcName}Schema`

export default MONGO_SCHEMA
