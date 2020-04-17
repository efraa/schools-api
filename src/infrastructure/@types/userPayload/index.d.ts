declare interface UserPayload {
  email?: string,
  username?: string,
  password?: string,
  role?: string,
  picture?: {
    url: string,
    id: string,
  }
  status?: string
  isGoogle?: boolean
  onBoarding?: boolean
  forgotToken?: string
  forgotExpire?: Date
}
