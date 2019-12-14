import { check, checkSchema, param } from 'express-validator'
import { AuthResponses } from './auth.responses'
import { getCommonPassword as passwords } from '@utils/readPassword'

const { validator } = AuthResponses

const signupValidator = [
  check('name', validator.name)
    .trim()
    .isLength({ min: 2 }),
  check('lastname', validator.lastname)
    .trim()
    .isLength({ min: 2 }),
  check('username', validator.username)
    .trim()
    .isLength({ min: 3 }),
  check('email', validator.email)
    .isEmail()
    .normalizeEmail({ all_lowercase: true }),
  check('password', validator.password)
    .trim()
    .not().isIn(passwords() as string[])
    .withMessage(validator.commonPass)
    .isLength({ min: 6 }),
  checkSchema({
    'gender': {
      in: 'body',
      matches: {
        options: [/\b(?:male|female|others)\b/],
        errorMessage: validator.gender
      }
    }
  })
]

export {
  signupValidator,
}
