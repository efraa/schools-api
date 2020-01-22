import { UserDTO, UserResponses, UserRepository, UserMapper } from './user.providers'
import { ErrorHandler, statusCodes } from '@http/routes'
import { deleteUploadedFiles } from '@utils/deleteUploadedFiles'
import { cloud } from '@utils/Cloudinary'
import { Roles } from '@utils/roles'

class UserService {
  public get = async (username: string, userLogged: UserDTO) : Promise<UserDTO> => {
    if (userLogged.username === username || userLogged.role === Roles.School) {
      const user = await UserRepository.getByUsername({ username, codeSchool: userLogged.codeSchool })
      if (!user)
        throw ErrorHandler.build({
          status: statusCodes.BAD_REQUEST,
          msg: UserResponses.userNotFound
        })
      console.log('efra')
      return await UserMapper.mapToDTO(user)
    }

    throw ErrorHandler.build({
      status: statusCodes.UNAUTHORIZED,
      msg: UserResponses.unauthorized
    })
  }

  public upload = async (props: {
    username: string,
    userLogged: UserDTO,
    picture: {
      path: string,
      name: string,
    },
  }): Promise<{
    picture: {
      url: string,
      id: string
    }
  }> => {
    const { username, userLogged, picture } = props
    if (userLogged.username === username || userLogged.role === Roles.School) {
      const user = await UserRepository.getByUsername({ username, codeSchool: userLogged.codeSchool })
      if (user) {

        const uploaded = await cloud.upload(picture.path, {
          folder: 'users',
          width: 200,
          crop: 'limit',
          format: 'jpg'
        })

        if (user.picture && user.picture.id)
          await cloud.destroy(user.picture.id)

        // Update user picture
        const changePicture = await UserRepository.update(user, { picture: {
          url: uploaded.secure_url,
          id: uploaded.public_id,
        }})

        await UserRepository.save(user)
        await deleteUploadedFiles(picture.name)

        return {
          picture: changePicture.picture
        }
      }
    }

    throw ErrorHandler.build({
      status: statusCodes.UNAUTHORIZED,
      msg: UserResponses.unauthorized
    })
  }
}

export default new UserService()
