const MONGO_CRUD_MODEL = `import { Model } from '@am92/mongo-odm'
import {rsrcName}Schema from './{rsrcName}.Schema.mjs'

const {rsrcName}Odm = new Model('{rsrcName}', {rsrcName}Schema)
const { createOne, list, findById, updateById, removeById } = {rsrcName}Odm

const {rsrcName}Model = {
  create: createOne,
  list,
  findById,
  updateById,
  removeById
}

export default {rsrcName}Model`

export default MONGO_CRUD_MODEL
