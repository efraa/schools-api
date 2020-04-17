// import { validators as AuthValidators } from '../../../../src/application/auth/utils/auth.validator'
import { validationResult } from 'express-validator'

// const validators = AuthValidators.bullLoad
// const count = validators.length - 1

export const userValidators = (userPayload) => {
  let validations: {}[] = []
  // validators.forEach((validator, i) =>
  //   validator(userPayload as Request, {}, () => {
  //     if (i === count) {
  //       const errors = validationResult(userPayload)
  //       if (!errors.isEmpty()) validations = [...errors.array()]
  //     }
  //   }))

  return validations
}

