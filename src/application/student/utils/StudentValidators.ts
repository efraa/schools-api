import { check } from 'express-validator'
import { StudentResponses } from './StudentResponses'

const { validator } = StudentResponses

const create = [
  check('name', validator('name')).isLength({ min: 3 }),
  check('lastname', validator('lastname', 4)).isLength({ min: 4 }),
]

export const validators = {
  create,
}
