import { userModule } from '../../application/user/modules/UserModule'
import { schoolModule } from '../../application/school/modules/SchoolModule'
import { userSchoolMock, schoolMock } from './mocks/SchoolMock'

export class UserSeed {
  async init() {
    console.log('Seeding school...')
    await userModule.controller.create(userSchoolMock).then(async () =>
      await userModule.userService.getUserByEmail(userSchoolMock.email).then(async userDTO => {
        if (!userDTO) return
        const school = await schoolModule.controller.create(userDTO, schoolMock)
        if (school) console.log('School seed completed.')
      })
    )
  }
}
