const SCHEMA_FILE = `import { Schema } from '@am92/opensearch-odm'
import { INDEX } from './{rsrcName}.Constants.mjs'

const properties = {
  // Schema Properties
}

const {rsrcName}Schema = new Schema(INDEX, properties)

export default {rsrcName}Schema`

export default SCHEMA_FILE
