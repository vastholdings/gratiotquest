import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { str } from '../util'

export interface Message {
  timestamp: number
  message: string
  username: string
}

function ChatMessage({ message }: { message: Message }) {
  const { timestamp, username, message: msg } = message
  return (
    <li>
      ({format(timestamp, 'yyyy/MM/dd')}) {username}: {msg}
    </li>
  )
}

export default function ChatMessages({ socket }: { socket: WebSocket }) {
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    if (!socket) {
      return
    }
    function handler(event: { data: string }) {
      const obj = JSON.parse(event.data) as {
        type: 'chat'
        message: string
        username: string
        timestamp: number
      }
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
          {messages.map(msg => (
            <ChatMessage key={str(msg)} message={msg}></ChatMessage>
          ))}
        </ul>
      </div>
    </div>
  )
}
