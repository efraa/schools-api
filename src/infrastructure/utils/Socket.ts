import socket from 'socket.io'
import { Configuration as config } from '../../../config/Configuration'

let instance: SocketInstance|undefined = undefined
class SocketInstance {
  private port: number = config.server.socketPort
  private server: SocketIO.Server = socket(this.port)
  constructor() {
    console.log(`[SOCKET SERVER]: running on port ${this.port}`)
  }

  public get io(): SocketIO.Server {
    return this.server
  }
}

const socketInstance = (): SocketInstance => !instance ? (instance = new SocketInstance()) : instance

export const io = socketInstance().io
