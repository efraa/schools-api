import { UserDTO, UserService } from './user.providers'

class UserController {
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
}

export default new UserController()
