import { Logger } from '../../src/infrastructure/utils/logging/Logger'

export const Failed = (props: {
  jobKey: string,
  err: string,
}) => Logger.error(`[JOB FAILED]: ${props.jobKey} | ${props.err}`)
