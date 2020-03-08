declare interface ClientInfo {
  agent: {
    browser: {
      name: string,
      version: string
    },
    device: {
      name: string,
      version: string
    },
    os: {
      name: string,
      version: string
    }
  },
  ip: string
}