const INDEX_FILE = `import {rsrcName}Schema from './{rsrcName}.Schema.mjs'
import {rsrcName}Model from './{rsrcName}.Model.mjs'
import {rsrcName}Controller from './{rsrcName}.Controller.mjs'
import {rsrcName}Router from './{rsrcName}.Router.mjs'

export { {rsrcName}Schema, {rsrcName}Model, {rsrcName}Controller, {rsrcName}Router }`

export default INDEX_FILE
