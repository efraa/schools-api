import { AuthRepository, AuthResponses } from './auth.providers'
import { Configuration as config } from '@config/Configuration'
import { ErrorHandler, statusCodes } from '@http/routes'
import { UserMapper } from '@app/user/user.providers'
import { encryptPassword } from '@utils/encryption'
import { JWToken } from '@utils/JWToken'
import { Roles } from '@utils/roles'

class AuthService {
  public signup = async (userPayload: any): Promise<{
    token: string
  }> => {
    const user = await UserMapper.mapToEntity({
      ...userPayload,
      isActive: userPayload.role === Roles.School,
      password: encryptPassword(userPayload.password)
    })

    const isRegistered = await AuthRepository.getByEmail(user.email)
    const usernameExists = await AuthRepository.getByUsername(user.username)

    if (isRegistered)
      throw ErrorHandler.build({
        status: statusCodes.BAD_REQUEST,
        msg: AuthResponses.emailExists
      })

    if (usernameExists)
      throw ErrorHandler.build({
        status: statusCodes.BAD_REQUEST,
        msg: AuthResponses.usernameExists
      })

    if (user.role !== Roles.School && !user.lastname)
      throw ErrorHandler.build({
        status: statusCodes.BAD_REQUEST,
        msg: AuthResponses.validator.lastname
      })

    if (user.role !== Roles.School) {
      if (!user.codeSchool)
        throw ErrorHandler.build({
          status: statusCodes.BAD_REQUEST,
          msg: AuthResponses.validator.codeSchool
        })

      const isSchool = await AuthRepository.findSchool(user.codeSchool)
      if (!isSchool) {
        throw ErrorHandler.build({
          status: statusCodes.NOT_FOUND,
          msg: AuthResponses.validator.schoolNotExist
        })

      } else if (!isSchool.isActive) {
        throw ErrorHandler.build({
          status: statusCodes.UNAUTHORIZED,
          msg: AuthResponses.validator.schoolDisabled
        })

      } else if (!isSchool.isPremium) {
        const members = await AuthRepository.schoolMembers(user.codeSchool)
        if (user.role === Roles.Teacher && members.teachers >= config.utils.maxTeachers)
          throw ErrorHandler.build({
            status: statusCodes.BAD_REQUEST,
            msg: AuthResponses.validator.maxTeachers
          })

        if (user.role === Roles.Student && members.students >= config.utils.maxStudents)
          throw ErrorHandler.build({
            status: statusCodes.BAD_REQUEST,
            msg: AuthResponses.validator.maxStudents
          })

      }
    }

    let created = await AuthRepository.save(user)
    if (created && created.role === Roles.School) {
      const school = await AuthRepository.update(created, {
        codeSchool: created.uuid.split('-')[0].slice(1)
      })
      created = await AuthRepository.save(school)
    }

    return await JWToken.generateToken(UserMapper.mapToDTO(created))
  }
}

export default new AuthService()
