import Queue, { Queue as IQueue } from 'bull'
import { Configuration as config } from '../config/Configuration'
import { Failed } from './utils/failed'

export const CreateQueue = (props: {
  name: string,
  handle: (data: any) => void,
}): {
  queue: IQueue,
  process: () => void,
} => {
  const queue = new Queue(props.name, { redis: config.redis })

  return {
    queue,
    process: () => {
      queue.process(props.handle)
      queue.on('failed', (job, err) => Failed({ jobKey: job.name, err: err.message }))
    }
  }
}