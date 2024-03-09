const SOCKET_URL = 'wss://kp00qnm3ma.execute-api.us-east-2.amazonaws.com/Prod/'

let serverP: Promise<WebSocket> | undefined

export function getSocket() {
  if (!serverP) {
    serverP = new Promise((resolve, reject) => {
      const s = new WebSocket(SOCKET_URL)

      s.onopen = () => {
        console.log('socket connection opened [state = ' + s.readyState + ']')
        resolve(s)
      }

      s.onerror = err => {
        console.error('socket connection error : ', err)
        reject(err)
      }
    })
  }
  return serverP
}
