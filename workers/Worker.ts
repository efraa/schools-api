
import * as listOfJobs from './jobs'

const queues = Object.values(listOfJobs).map(job => job)
const process = () => queues.forEach(queue => queue.process())

export const Worker = {
  queues,
  ...listOfJobs,
  process,
}
