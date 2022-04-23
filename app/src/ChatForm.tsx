import { useState } from 'react'
import { str } from './util'

export default function ChatForm({ socket }: { socket: WebSocket }) {
  const [message, setMessage] = useState('')
  const username = localStorage.getItem('username')
  return (
    <form
      onSubmit={event => {
        socket.send(
          str({
            action: 'sendmessage',
            data: str({
              type: 'chat',
              message,
              username,
              timestamp: +Date.now(),
            }),
          }),
        )
        setMessage('')
        event.preventDefault()
      }}
    >
      <input
        autoComplete="off"
        onChange={event => setMessage(event.target.value)}
        value={message}
      />
      <button>Send</button>
    </form>
  )
}
