import socket from 'socket.io'

let instance: Socket|undefined = undefined
class Socket {
  private io: SocketIO.Server = socket(4000)
  constructor() {
    console.log(`Socket server listening to ${4000}`)
    this.on({
      event: 'connection',
      cb: (socket: SocketIO.Client) => console.log('Client connected', socket),
    })
  }

  public emit = (props: {
    event: string,
    data: any,
  }) => this.io.emit(props.event, props.data)

  public on = (props: {
    event: string,
    cb: Function,
  }) => this.io.on(props.event, props.cb)
}

const socketInstance = (): Socket => {
  if (!instance) {
    instance = new Socket()
  }
  return instance
};

export default {
  socketInstance,
};
