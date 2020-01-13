import { UserDTO, UserResponses, UserRepository, UserMapper } from './user.providers'
import { ErrorHandler, statusCodes } from '@http/routes'
import { deleteUploadedFiles } from '@utils/deleteUploadedFiles'
import { cloud } from '@utils/Cloudinary'

class UserService {
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
    if (userLogged.username === username) {
      const user = await UserRepository.getByUsername(username)
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
        await deleteUploadedFiles(`users/${picture.name}`)

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
