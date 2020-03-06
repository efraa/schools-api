import { CreateQueue } from '../../CreateQueue'
import { IBulkLoadJob } from './IBulkLoadJob'
import { BulkLoadTask } from './Task'

const BulkLoadQueue = CreateQueue({ name: BulkLoadTask.key, handle: BulkLoadTask.handle })

export const BulkLoadJob = {
  ...BulkLoadQueue,
  add: (data: IBulkLoadJob) =>
    BulkLoadQueue.queue.add({ file: data.file, userLogged: data.userLogged })
}
