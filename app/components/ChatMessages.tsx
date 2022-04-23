import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { str } from '../util'

export interface Message {
  timestamp: number
  message: string
  username: string
}

export default function ChatMessages({ socket }: { socket: WebSocket }) {
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    if (!socket) {
      return
    }
    function handler(event: any) {
      const obj = JSON.parse(event.data)
      if (obj.type === 'chat') {
        setMessages([...messages, obj])
      }
    }
    socket.addEventListener('message', handler)
    return () => {
      socket.removeEventListener('message', handler)
    }
  }, [messages, socket])
  return (
    <div
      style={{
        padding: 20,
        height: 600,
        width: '100%',
      }}
    >
      <h3>gratiot chat</h3>
      <div
        id="messages"
        style={{
          display: 'flex',
          flexDirection: 'column-reverse',
        }}
      >
        <ul>
          {messages.map(msg => {
            const { timestamp, username, message } = msg
            return (
              <li key={str(msg)}>
                ({format(timestamp, 'yyyy/MM/dd')}) {username}: {message}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
