export interface IEmailJob {
  to: string,
  subject: string,
  template: string,
  data?: {} | any
}
