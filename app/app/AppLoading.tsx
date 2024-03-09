import { getSocket } from '@/util/socket'
import { useEffect, useState } from 'react'

export default function AppLoading() {
  const [socket, setSocket] = useState<WebSocket>()
  const [error, setError] = useState<unknown>()

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    ;(async () => {
      try {
        setSocket(await getSocket())
      } catch (e) {
        console.error(e)
        setError(e)
      }
    })()
  }, [])
  return !socket ? (
    <h1>Loading...</h1>
  ) : error ? (
    <h1 className="error">{`${error}`}</h1>
  ) : (
    <App socket={socket} />
  )
}
