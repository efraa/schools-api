import { check } from 'express-validator'
import { SchoolResponses } from './SchoolResponses'

const { validator } = SchoolResponses

const create = [
  check('name', validator('name')).isLength({ min: 3 }),
  check('dean', validator('dean')).optional().isLength({ min: 3 }),
  check('slogan', validator('slogan')).optional().isLength({ min: 3 }),
  check('type', validator('type')).isLength({ min: 3 }),
  check('zone', validator('zone')).isLength({ min: 3 }),
  check('website', validator('website', 5)).optional().isURL(),
]

export const validators = {
  create,
}
