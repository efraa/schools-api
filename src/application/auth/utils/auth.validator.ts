import { check, checkSchema } from 'express-validator'
import { AuthResponses } from './auth.responses'
import { getCommonPassword as passwords } from '@utils/readPassword'

const { validator, auth } = AuthResponses

const signup = [
  check('name', validator.name)
    .trim()
    .isLength({ min: 2 }),
  check('lastname', validator.lastname)
    .optional()
    .trim()
    .isLength({ min: 2 }),
  check('codeSchool', validator.codeSchool)
    .optional()
    .trim()
    .isLength({ min: 6 }),
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
    'role': {
      in: 'body',
      matches: {
        options: [/\b(?:school|teacher|student|owner)\b/],
        errorMessage: validator.role
      }
    }
  })
]

const authentication = [
  check('emailOrUsername', auth.validator.emailOrUsername)
    .isLength({
      min: 3
    }),
  check('password', validator.password)
    .isLength({
      min: 6
    })
]

export const validators = {
  signup,
  authentication
}
