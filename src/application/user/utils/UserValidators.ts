import { check } from 'express-validator'
import { UserResponses } from './UserResponses'
import { getCommonPassword as passwords } from '../../../infrastructure/utils'

const { VALIDATOR } = UserResponses

const signup = [
  check('name', VALIDATOR.NAME)
    .trim()
    .isLength({ min: 3 }),
  check('email', VALIDATOR.EMAIL)
    .isEmail()
    .normalizeEmail({ all_lowercase: true }),
  check('username', VALIDATOR.USERNAME)
    .trim()
    .isLength({ min: 3 }),
  check('password', VALIDATOR.PASSWORD)
    .trim()
    .not().isIn(passwords() as string[])
    .withMessage(VALIDATOR.COMMON_PASSWORD)
    .isLength({ min: 6 })
]

export const validators = {
  signup,
}
