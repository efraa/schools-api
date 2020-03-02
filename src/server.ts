import { DatabaseConnection } from './database/DatabaseConnection'
import { Logger } from './infrastructure/utils/logging/Logger'
import http, { Server } from 'http'
import socket from 'socket.io'
import { app } from './app'
import { Events } from './socket'

// HTTP Server
const server: Server = http.createServer(app)

// Socket Server
const io = socket(server)

try {
  // Lauch Server
  server.listen(app.get('port'), async () => {
    const connected = await DatabaseConnection
      .connect()

    if (connected)
      console.log('[API SERVER]: running on port', app.get('port'))

    io.on(Events.CONNECTION, () => console.log('[SOCKER SERVER]: a new client connected'))
  })
} catch (error) {
  Logger.error(error)
  process.exit()
}

export {
  io,
  server
}
