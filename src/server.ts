import { Logger } from './infrastructure/utils/logging/Logger'
import http, { Server } from 'http'
import { Events } from './socket'
import socket from 'socket.io'
import { app, initialize } from './app'

// HTTP Server
const server: Server = http.createServer(app)

// Socket Server
const io = socket(server)

try {
  // Lauch App and Connected to Database
  initialize().then(() => {
    server.listen(app.get('port'), () => {
      console.log('[API SERVER]: running on port', app.get('port'))
      io.on(Events.CONNECTION, () => console.log('[SOCKER SERVER]: a new client connected'))
    })
  })
} catch (error) {
  Logger.error(error)
  process.exit()
}

export {
  io,
  server
}
