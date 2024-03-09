import ChatForm from '@/components/ChatForm'
import ChatMessages from '@/components/ChatMessages'

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
        <Game socket={socket} username={username} />
      )}
      <ChatMessages socket={socket} />
      <ChatForm socket={socket} />
    </div>
  )
}
