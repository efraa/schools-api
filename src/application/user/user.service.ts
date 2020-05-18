import { UserDTO, UserResponses, UserRepository, UserMapper, User } from './user.providers'
import { ErrorHandler, statusCodes } from '../../infrastructure/http/routes'
import { deleteUploadedFiles, cloud, Roles } from '../../infrastructure/utils'
import { FindOperator, Not, Like } from 'typeorm'
import { Worker } from '../../../workers'

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
    if (userLogged.username === username) {
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

  public bulkLoad = async (props: {
    userLogged: UserDTO,
    file: string,
  }) => {
    const { userLogged, file } = props
    if (userLogged.role === Roles.School) {
      await Worker.BulkLoadJob.add({
        file,
        userLogged
      })
      // Emit Socket

      return UserResponses.bulkLoad
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
    const { status, role, search, userLogged } = props
    if (userLogged.role === Roles.School) {
      const page = props.page || 1
      const where: {}[] = []
      const defaultValues: {
        codeSchool: string,
        isActive: string,
        role: FindOperator<Roles>|string,
      } = {
        codeSchool: userLogged.codeSchool,
        isActive: status ? status : 'true',
        role: Not(Roles.School)
      }
      const perPage = props.perPage || 25
      const queryBuilder = (field?: string, queryString?: string[]): void => {
        const wordSearch = (word: string) => {
          let options = { ...defaultValues }
          role && (options.role = role)
          if (field)
            options[field] = Like(`%${word.trim().toLocaleLowerCase()}%`)

          where.push(options)
        }

        if (queryString) {
          queryString.length === 1 ?
            wordSearch(queryString[0]) : queryString.map(word => wordSearch(word))
        }
      }

      if (search) {
        const terms = search.split(' ')
        const fields = ['name', 'lastname', 'username']
        terms.length > 1 && (fields.pop())
        fields.forEach(field => queryBuilder(field, terms))
      } else where.push(defaultValues)

      const query: any = await UserRepository.listOfMembers({
        page,
        perPage,
        where
      })

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
