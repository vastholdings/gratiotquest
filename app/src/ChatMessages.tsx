import { format } from 'date-fns'
import { str } from './util'

export interface Message {
  timestamp: number
  message: string
  username: string
}

export default function ChatMessages({ messages }: { messages: Message[] }) {
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
