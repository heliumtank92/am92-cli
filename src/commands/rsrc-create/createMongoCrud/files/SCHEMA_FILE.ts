const SCHEMA_FILE = `import { buildSchema } from '@am92/mongo-odm'

const schemaObject = {
  // Schema Properties as defined by mongoose Schema Class
}

const schemaOptions = {}

const {rsrcName}Schema = buildSchema(schemaObject, schemaOptions)

export default {rsrcName}Schema`

export default SCHEMA_FILE
