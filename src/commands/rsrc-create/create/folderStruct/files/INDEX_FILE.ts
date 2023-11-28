const INDEX_FILE = `import {rsrcName}Model from './{rsrcName}.Model/index.mjs'
import {rsrcName}Controller from './{rsrcName}.Controller/index.mjs'
import {rsrcName}Router from './{rsrcName}.Router/index.mjs'

export { {rsrcName}Model, {rsrcName}Controller, {rsrcName}Router }`

export default INDEX_FILE
