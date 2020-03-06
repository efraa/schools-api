import { perUserInFile, userValidators } from './utils'

const addMember = async userPayload => {
  const errors = userValidators(userPayload)
  console.log(errors)
  if (errors) {
    console.log(errors)
  }
}

export const BulkLoadTask = {
  key: 'BULK_MEMBERS_LOAD_JOB',
  async handle({ data: { file, userLogged } }) {
    await perUserInFile(file, userLogged, addMember)
  },
}
