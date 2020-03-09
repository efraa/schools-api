import request from 'supertest'
import { statusCodes } from '../src/infrastructure/routes'
import { Configuration as config } from '../config/Configuration'
import { UserResponses } from '../src/application/user/utils/UserResponses'
const api = request.agent(config.test.uri)

/*****************************************************
*  Integration Test of User Actions                  *
******************************************************/
const userMock = {
  name: 'TestUser',
  username: 'school-usertest',
  email: 'testuser@schools.com',
  password: 'schoolsPass23',
  emailOrUsername: 'school-usertest',
}
let token: string = ''

describe('Integration of ExpressJS controllers and routes, Endpoint delivery', () => {

  describe('Signup as school account', () => {
    const path = '/users/signup'
    it('[POST]: /users/signup | Create school user', async () => {
      const user: any = await api.post(path)
        .send(userMock)
      expect(user.statusCode).toEqual(statusCodes.CREATE)
      expect(user.body).toHaveProperty('token')
    })

    it('[POST]: /users/signup | Email is already registered.', async () => {
      const user: any = await api.post(path)
        .send(userMock)
      expect(user.statusCode).toEqual(statusCodes.BAD_REQUEST)
      expect(user.body[0]).toHaveProperty('msg')
      expect(user.body[0].msg).toEqual(UserResponses.EMAIL_EXISTS)
    })
  })

  describe('User Authentication', () => {
    const path = '/users/login'
    it('[POST]: /login', async () => {
      const user: any = await api.post(path)
        .send(userMock)
      expect(user.statusCode).toEqual(statusCodes.OK)
      expect(user.body).toHaveProperty('token')
      token = user.body.token
    })

    it('[POST]: /login | BAD_CREDENTIALS', async () => {
      const user: any = await api.post(path)
        .send({
          emailOrUsername: userMock.emailOrUsername,
          password: 'incorrectPassword',
        })
      expect(user.statusCode).toEqual(statusCodes.BAD_REQUEST)
      expect(user.body[0]).toHaveProperty('msg')
      expect(user.body[0].msg).toEqual(UserResponses.BAD_CREDENTIALS)
    })
  })

//   it('Get user', async () => {
//     const get: any = await api.get(`/user/${userMock.username}`)
//       .set('Authorization', token)
//     expect(get.statusCode).toEqual(statusCodes.OK)
//     expect(get.body).toHaveProperty('data')
//   })

//   it('Update user', async () => {
//     const get: any = await api.put(`/user/${userMock.username}`)
//       .set('Authorization', token)
//       .send({
//         name: 'Name changed',
//         lastname: 'Lastname changed',
//       })
//     expect(get.statusCode).toEqual(statusCodes.OK)
//     expect(get.body).toHaveProperty('data')
//   })

//   it('Change Password', async () => {
//     const get: any = await api.put('/account/change_password')
//       .set('Authorization', token)
//       .send({
//         password: userMock.password,
//         newPassword: 'passwordChange',
//       })
//     expect(get.statusCode).toEqual(statusCodes.OK)
//     expect(get.body.data).toHaveProperty('msg')
//   })

//   it('Forgot Password', async () => {
//     const get: any = await api.post('/account/forgot_password')
//       .send({
//         email: userMock.email
//       })
//     expect(get.statusCode).toEqual(statusCodes.OK)
//     expect(get.body.data).toHaveProperty('msg')
//   })

//   it('Delete user', async () => {
//     const get: any = await api.delete(`/user/${userMock.username}`)
//       .set('Authorization', token)
//     expect(get.statusCode).toEqual(statusCodes.OK)
//     expect(get.body.data).toHaveProperty('msg')
//   })
})
