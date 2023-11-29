const ES_SCHEMA = `import { Schema } from '@am92/opensearch-odm'
import { INDEX } from '{constantsPath}'

const properties = {}

const {rsrcName}Schema = new Schema(INDEX, properties)

export default {rsrcName}Schema`

export default ES_SCHEMA
