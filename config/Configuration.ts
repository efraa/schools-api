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
  nodemailer: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    from: process.env.MAILER_FROM || 'Schools <password@schools.com>',
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    }
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
