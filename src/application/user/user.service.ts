import { UserDTO, UserResponses, UserRepository, UserMapper, User } from './user.providers'
import { ErrorHandler, statusCodes } from '../../infrastructure/http/routes'
import { deleteUploadedFiles, cloud, Roles } from '../../infrastructure/utils'

class UserService {
  public get = async (username: string, userLogged: UserDTO) : Promise<UserDTO> => {
    if (userLogged.username === username || userLogged.role === Roles.School) {
      const user = await UserRepository.getByUsername({ username, codeSchool: userLogged.codeSchool })
      if (!user)
        throw ErrorHandler.build(statusCodes.BAD_REQUEST, UserResponses.userNotFound)

      return await UserMapper.mapToDTO(user)
    }

    throw ErrorHandler.build(statusCodes.UNAUTHORIZED, UserResponses.unauthorized)
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

    throw ErrorHandler.build(statusCodes.UNAUTHORIZED, UserResponses.unauthorized)
  }

  public listOfmembers = async (props: {
    userLogged: UserDTO,
    perPage?: number,
    page?: number,
    schedule?: string,
    status?: string,
    role?: string,
    search?: string
  }) : Promise<{
    users: UserDTO[],
    allUsers: number,
    pages: number
  }> => {
    const { page, perPage, status, role, search, userLogged } = props
    if (userLogged.role === Roles.School) {
      const query: any = await UserRepository.listOfMembers({
        page,
        perPage,
        codeSchool: userLogged.codeSchool,
        status,
        role,
        search,
      })
      // console.log(query.rows)

      if (!query.rows[0])
        throw ErrorHandler.build(statusCodes.NOT_FOUND, UserResponses.noRecords)

      return {
        users: UserMapper.mapListToDTO(query.rows),
        allUsers: query.allUsers,
        pages: query.pages
      }
    }

    throw ErrorHandler.build(statusCodes.UNAUTHORIZED, UserResponses.unauthorized)
  }
}

export default new UserService()
