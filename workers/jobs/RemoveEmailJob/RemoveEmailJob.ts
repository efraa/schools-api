import { CreateQueue } from '../../CreateQueue'
import { IRemoveEmailJob } from './IRemoveEmailJob'
import { RemoveEmailTask } from './Task'

const RemoveEmailQueue = CreateQueue({ name: RemoveEmailTask.key, handle: RemoveEmailTask.handle })

export const RemoveEmailJob = {
  ...RemoveEmailQueue,
  add: (data: IRemoveEmailJob) => RemoveEmailQueue.queue.add(data, {
    delay: data.expire.getTime() - (new Date().getTime()),
    attempts: 3,
    removeOnComplete: true,
    removeOnFail: true
  })
}
