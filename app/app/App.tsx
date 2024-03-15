import { useLocalStorage } from '@/util'
import { useState } from 'react'
import ChatForm from '@/components/ChatForm'
import ChatMessages from '@/components/ChatMessages'
import StartScreen from '@/components/StartScreen'
import Game from './Game'
import UsernameDialog from '@/components/UsernameDialog'

export default function App({ socket }: { socket: WebSocket }) {
  const [username, setUsername] = useLocalStorage('username', '')
  const [gameStarted, setGameStarted] = useState(false)

  return (
    <div className="container">
      {!username ? (
        <UsernameDialog username={username} submit={arg => setUsername(arg)} />
      ) : null}
      {!gameStarted ? (
        <StartScreen startGame={() => setGameStarted(true)} />
      ) : (
        <Game />
      )}
      <ChatMessages socket={socket} />
      <ChatForm socket={socket} />
    </div>
  )
}
