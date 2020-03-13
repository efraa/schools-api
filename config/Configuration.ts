import dotenv from 'dotenv'
dotenv.config({
  path: '.env'
})

export const Configuration = {
  server: {
    port: parseInt(process.env.PORT as string),
    prefixRoutes: process.env.PREFIX_ROUTES,
  },
  jwt: {
    secret: process.env.SECRET,
    tokenExpire: process.env.TOKEN_EXPIRE,
  },
  forgotPass: {
    url: process.env.AGENT_CLIENT_URI
  },
  test: {
    uri: process.env.TEST_URI
  },
  utils: {
    uploads: process.env.UPLOADS_USERS || 'uploads',
    maxTeachers: process.env.MAX_TEACHERS || 4,
    maxStudents: process.env.MAX_STUDENTS || 25,
    googleClientID: process.env.GOOGLE_CLIENT_ID,
    slackHook: process.env.SLACK_WEBHOOK,
  },
  redis: process.env.REDIS_URI,
}
