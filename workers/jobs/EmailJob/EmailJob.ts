import { CreateQueue } from '../../CreateQueue'
import { IEmailJob } from './IEmailJob'
import { EmailTask } from './Task'

const EmailQueue = CreateQueue({ name: EmailTask.key, handle: EmailTask.handle })

export const EmailJob = {
  ...EmailQueue,
  add: (email: IEmailJob) => EmailQueue.queue.add({ email })
}
