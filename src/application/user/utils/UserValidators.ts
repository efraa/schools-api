import { check, param } from 'express-validator'
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

const login = [
  check('emailOrUsername', VALIDATOR.EMAIL_OR_USERNAME)
    .isLength({
      min: 3
    }),
  check('password', VALIDATOR.PASSWORD)
    .isLength({
      min: 6
    })
]

const forgotPassword = [
  check('email', VALIDATOR.EMAIL)
    .isEmail()
    .normalizeEmail({ all_lowercase: true }),
]

const forgotPassExpire = [
  param('token', VALIDATOR.TOKEN)
    .isLength({
      min: 8
    })
]

const resetPass = [
  check('password', VALIDATOR.PASSWORD)
    .trim()
    .not().isIn(passwords() as string[])
    .withMessage(VALIDATOR.COMMON_PASSWORD)
    .isLength({
      min: 6
    }),
  param('token', VALIDATOR.TOKEN)
    .isLength({
      min: 10
    })
]

export const validators = {
  signup,
  login,
  forgotPassword,
  forgotPassExpire,
  resetPass,
}
