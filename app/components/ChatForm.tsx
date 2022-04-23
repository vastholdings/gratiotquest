import { useState } from 'react'
import { send } from '../util'

export default function ChatForm({ socket }: { socket: WebSocket }) {
  const [message, setMessage] = useState('')
  const username = localStorage.getItem('username')
  return (
    <form
      className="chat"
      onSubmit={event => {
        send(socket, {
          type: 'chat',
          message,
          username,
          timestamp: +Date.now(),
        })
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
