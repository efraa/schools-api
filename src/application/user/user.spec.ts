import request from 'supertest'
import { statusCodes } from '../../infrastructure/http/response'
import { Configuration as config } from '../../../config/Configuration'
import { AuthResponses } from '../auth/utils/auth.responses'
const api = request.agent(config.test.uri)

/*****************************************************
*  Integration Test of User Actions                  *
******************************************************/
const userMock = {
  name: 'TestUser',
  lastname: 'Test',
  username: 'efra-usertest',
  email: 'testuser@schools.com',
  password: 'schoolsPass23',
  gender: 'male',
  role: 'owner',
  emailOrUsername: 'efra-usertest',
}
let token: string = ''

describe('Integration of ExpressJS controllers and routes, Endpoint delivery.', () => {
  it('Create User', async () => {
    const register: any = await api.post('/register')
      .send(userMock)
    expect(register.statusCode).toEqual(statusCodes.CREATE)
    expect(register.body).toHaveProperty('data')
  })

  it('Create user with email that is already registered.', async () => {
    const register: any = await api.post('/register')
      .send(userMock)
    expect(register.statusCode).toEqual(statusCodes.BAD_REQUEST)
    expect(register.body).toHaveProperty('data')
    expect(register.body.data.msg).toEqual(AuthResponses.emailExists)
  })

  it('Authenticate user', async () => {
    const auth: any = await api.post('/auth')
      .send(userMock)
    expect(auth.statusCode).toEqual(statusCodes.OK)
    expect(auth.body).toHaveProperty('data')
    token = auth.body.data
  })

  it('Authenticate user with incorrect data.', async () => {
    const auth: any = await api.post('/auth')
      .send({
        emailOrUsername: userMock.emailOrUsername,
        password: 'incorrectPassword',
      })
    expect(auth.statusCode).toEqual(statusCodes.BAD_REQUEST)
    expect(auth.body).toHaveProperty('data')
    expect(auth.body.data.msg).toEqual(AuthResponses.auth.badCredentials)
  })

  it('Get user', async () => {
    const get: any = await api.get(`/user/${userMock.username}`)
      .set('Authorization', token)
    expect(get.statusCode).toEqual(statusCodes.OK)
    expect(get.body).toHaveProperty('data')
  })

  it('Update user', async () => {
    const get: any = await api.put(`/user/${userMock.username}`)
      .set('Authorization', token)
      .send({
        name: 'Name changed',
        lastname: 'Lastname changed',
      })
    expect(get.statusCode).toEqual(statusCodes.OK)
    expect(get.body).toHaveProperty('data')
  })

  it('Change Password', async () => {
    const get: any = await api.put('/account/change_password')
      .set('Authorization', token)
      .send({
        password: userMock.password,
        newPassword: 'passwordChange',
      })
    expect(get.statusCode).toEqual(statusCodes.OK)
    expect(get.body.data).toHaveProperty('msg')
  })

  it('Forgot Password', async () => {
    const get: any = await api.post('/account/forgot_password')
      .send({
        email: userMock.email
      })
    expect(get.statusCode).toEqual(statusCodes.OK)
    expect(get.body.data).toHaveProperty('msg')
  })

  it('Delete user', async () => {
    const get: any = await api.delete(`/user/${userMock.username}`)
      .set('Authorization', token)
    expect(get.statusCode).toEqual(statusCodes.OK)
    expect(get.body.data).toHaveProperty('msg')
  })
})
