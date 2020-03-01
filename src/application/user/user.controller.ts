import { UserDTO, UserService } from './user.providers'

class UserController {
  public get = async (username: string, userLogged: UserDTO): Promise<UserDTO> =>
    await UserService.get(username, userLogged)

  public upload = async (query: {
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
  }> => await UserService.upload(query)

  public listOfMembers = async (query: {
    userLogged: UserDTO,
    perPage?: number,
    page?: number,
    search?: string,
    status?: string,
    role?: string
  }) => await UserService.listOfmembers(query)
}

export default new UserController()
