import { AuthRepository, AuthResponses } from './auth.providers'
import { Configuration as config } from '../../../config/Configuration'
import { ErrorHandler, statusCodes } from '../../infrastructure/http/routes'
import { UserMapper, User } from '../user/user.providers'
import { encryptPassword, comparePassword, JWToken, Roles } from '../../infrastructure/utils'
import crypto from 'crypto'

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

  public auth = async (userPayload: {
    emailOrUsername: string,
    password: string
  }): Promise<{
    token: string
  }> => {
    const { emailOrUsername, password } = userPayload
    const getUserByEmail = await AuthRepository.getByEmail(emailOrUsername)
    const getUserByUsername = await AuthRepository.getByUsername(emailOrUsername)
    const user = getUserByEmail || getUserByUsername

    if (!user)
      throw ErrorHandler.build({
        status: statusCodes.BAD_REQUEST,
        msg: AuthResponses.auth.accountDoesNotExist
      })

    if (user && comparePassword(password, user.password)) {
      if (!user.isActive && user.role !== Roles.School)
        throw ErrorHandler.build({
          status: statusCodes.UNAUTHORIZED,
          msg: AuthResponses.auth.accountIsDisable
        })

      return await JWToken.generateToken(UserMapper.mapToDTO(user))
    }

    throw ErrorHandler.build({
      status: statusCodes.BAD_REQUEST,
      msg: AuthResponses.auth.badCredentials
    })
  }

  public forgotPassword = async (email: string): Promise<{
    token: string,
    user: User
  }> => {
    const user = await AuthRepository.getByEmail(email)

    if (!user)
      throw ErrorHandler.build({
        status: statusCodes.BAD_REQUEST,
        msg: AuthResponses.auth.accountDoesNotExist
      })

    // Generate Token
    const token: string = crypto.randomBytes(20).toString('hex')
    const forgotPasswordToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex')

    const expireDate = new Date()
    // Increase 30 minutes to the current time
    expireDate.setMinutes(expireDate.getMinutes() + 30)
    const forgotPasswordExpire = expireDate
    const updateUser = await AuthRepository.update(user,
      { forgotPasswordToken, forgotPasswordExpire })

    if (updateUser)
      await AuthRepository.save(user)

    return {
      token: forgotPasswordToken,
      user: updateUser,
    }
  }

  public checkPasswordExpire = async (token: string): Promise<User> => {
    const user = await AuthRepository
      .getByForgotPasswordToken(token)

    if (!user)
      throw ErrorHandler.build({
        status: statusCodes.BAD_REQUEST,
        msg: AuthResponses.forgotPass.userNotFound
      })

    return user
  }

  public resetPassword = async (token: string, password: string): Promise<any> => {
    const user = await this.checkPasswordExpire(token)
    if (user) {
      const newPassword = encryptPassword(password)
      const updateUser = await AuthRepository.update(user,
        {
          forgotPasswordToken: null,
          forgotPasswordExpire: null,
          password: newPassword,
        })

      if (updateUser) await AuthRepository.save(user)

      return AuthResponses.forgotPass.success
    }
  }
}

export default new AuthService()
