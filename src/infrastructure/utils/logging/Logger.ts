import { createLogger, transports, format } from 'winston'
import { SlackHook } from './SlackHook'

const state = {
  msgFormat: format.combine(
    format.simple(),
    format.timestamp(),
    format.printf(info => `[${info.timestamp}]: ${info.level.toUpperCase()} | ${info.message}`),
  ),
  production: process.env.NODE_ENV === 'production',
}

const { msgFormat, production } = state
const communicateBy = production ? [SlackHook] :
  [
    SlackHook,
    new transports.Console(),
    new transports.File({
      maxsize: 5000000,
      maxFiles: 2,
      filename: 'logs/server.log'
    }),
  ]

const defaultLogger = createLogger({ format: msgFormat, transports: communicateBy })

export const Logger = {
  error: message => defaultLogger.error(message),
  info: message => defaultLogger.info(message),
}
