const MODEL_FILE = `import { Model } from '@am92/mongo-odm'
import {rsrcName}Schema from './{rsrcName}.Schema.mjs'

const {rsrcName}Odm = new Model('{rsrcName}', {rsrcName}Schema)
const { createOne, list, findById, updateById, removeById } = {rsrcName}Odm

const {rsrcName}Model = {
  create: createOne,
  list: list,
  findById: findById,
  updateById: updateById,
  removeById: removeById
}

export default {rsrcName}Model`

export default MODEL_FILE
