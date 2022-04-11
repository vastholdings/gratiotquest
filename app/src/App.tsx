import { useRef, useEffect, useState } from 'react'

import { format } from 'date-fns'

function str(obj: unknown) {
  return JSON.stringify(obj)
}

interface Message {
  timestamp: number
  message: string
  username: string
}

async function loadImage(str: string) {
  const img = new Image()
  img.src = str
  await img.decode()
  return img
}

const SOCKET_URL = 'wss://kp00qnm3ma.execute-api.us-east-2.amazonaws.com/Prod/'

let serverP: Promise<WebSocket> | undefined

function getSocket() {
  if (!serverP) {
    serverP = new Promise<WebSocket>((resolve, reject) => {
      const s = new WebSocket(SOCKET_URL)

      s.onopen = () => {
        console.log(
          'socket connection is opened [state = ' + s.readyState + ']',
        )
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

// Hook
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.log(error)
      return initialValue
    }
  })
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.log(error)
    }
  }
  return [storedValue, setValue] as const
}

function App() {
  const ref = useRef<HTMLCanvasElement>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [socket, setSocket] = useState<WebSocket>()
  const [error, setError] = useState<unknown>()
  const [username, setUsername] = useLocalStorage('username', '')
  const [gameStarted, setGameStarted] = useState(false)

  useEffect(() => {
    if (socket) {
      socket.onmessage = function (event) {
        const obj = JSON.parse(event.data)
        if (obj.type === 'chat') {
          setMessages([...messages, obj])
        }
      }
    }
  }, [messages, socket])

  useEffect(() => {
    ;(async () => {
      try {
        setSocket(await getSocket())
      } catch (e) {
        setError(e)
      }
    })()
  }, [])

  useEffect(() => {
    ;(async () => {
      let i = 0
      try {
        if (!gameStarted) {
          return
        }
        const can = ref.current
        if (!can) {
          return
        }
        const ctx = can.getContext('2d')
        if (!ctx) {
          return
        }
        if (!socket) {
          return
        }
        // player's position
        // let playerid: any
        // let allPlayers = {} as any
        // let allCatfood = {} as any
        // let counter = 0
        let catfood: HTMLImageElement
        const arrayWidth = 5
        const arrayHeight = 5
        const imageWidth = 2800
        const imageHeight = 1600
        const bird = [] as HTMLImageElement[]

        // function draw() {
        //   Object.keys(allPlayers).forEach(player => {
        //     if (allPlayers[player].moving) {
        //       allPlayers[player].frame = Math.floor((counter % 8) / 4)
        //       counter += 1
        //     }
        //     ctx.drawImage(
        //       bird[allPlayers[player].frame || 0],
        //       allPlayers[player].x,
        //       allPlayers[player].y,
        //       100,
        //       100,
        //     )
        //   })

        //   Object.keys(allCatfood).forEach(p => {
        //     ctx.drawImage(catfood, allCatfood[p].x, allCatfood[p].y, 20, 20)
        //   })
        // }

        function myRenderTileSetup(
          ctx: CanvasRenderingContext2D,
          width: number,
          height: number,
        ) {
          const offsetX = 0 //allPlayers[playerid].x
          const offsetY = 0 //allPlayers[playerid].y
          ctx.translate(-offsetX + 5000, -offsetY + 5000)
          ctx.clearRect(0, 0, width, height)
          console.log({ arrayWidth, arrayHeight })
          ctx.drawImage(imageArray[0], 0, 0)
          for (let y = 0; y < arrayWidth; y++) {
            for (let x = 0; x < arrayHeight; x++) {
              const pos = x + y * arrayWidth
              if (imageArray[pos]?.complete) {
                console.log(
                  (pos % arrayWidth) * imageWidth,
                  Math.floor(pos / arrayWidth) * imageHeight,
                  imageArray[pos],
                  pos,
                  x,
                  y,
                )
                ctx.drawImage(
                  imageArray[pos],
                  (pos % arrayWidth) * imageWidth,
                  Math.floor(pos / arrayWidth) * imageHeight,
                )
              }
            }
          }
          // draw()

          // ctx.restore()
          // // Create gradient
          // const gradient = ctx.createLinearGradient(0, 0, 400, 0)
          // gradient.addColorStop(Math.random(), 'magenta')
          // gradient.addColorStop(Math.random(), 'blue')
          // gradient.addColorStop(Math.random(), 'red')
          // ctx.fillStyle = gradient
          // ctx.font = 'bold 30px verdana'
          // ctx.fillText(`SCORE: ${allPlayers[playerid].score}`, 100, 100)

          // window.requestAnimationFrame(() => myRenderTileSetup(ctx))
        }

        const movement = {
          up: false,
          down: false,
          left: false,
          right: false,
        }
        document.addEventListener('keydown', event => {
          switch (event.key) {
            case 'ArrowLeft':
              movement.left = true
              break
            case 'ArrowUp':
              movement.up = true
              break
            case 'ArrowRight':
              movement.right = true
              break
            case 'ArrowDown':
              movement.down = true
              break

            default:
          }
          if (movement.left || movement.up || movement.right || movement.down) {
            // socket.emit('startmove')
          }
        })

        document.addEventListener('keyup', event => {
          switch (event.key) {
            case 'ArrowLeft':
              movement.left = false
              break
            case 'ArrowUp':
              movement.up = false
              break
            case 'ArrowRight':
              movement.right = false
              break
            case 'ArrowDown':
              movement.down = false
              break
            default:
          }
          if (
            !movement.left &&
            !movement.up &&
            !movement.right &&
            !movement.down
          ) {
            // socket.emit('endmove')
          }
        })

        function touchHandler(e: any) {
          if (e.touches && can) {
            const playerX = e.touches[0].pageX - can.offsetLeft
            const playerY = e.touches[0].pageY - can.offsetTop
            if (playerX > 420) {
              movement.right = true
            }
            if (playerX < 320) {
              movement.left = true
            }
            if (playerY > 340) {
              movement.down = true
            }
            if (playerY < 260) {
              movement.up = true
            }
            if (
              movement.left ||
              movement.up ||
              movement.right ||
              movement.down
            ) {
              if (socket) {
                socket.send(
                  str({
                    action: 'sendmessage',
                    data: str({
                      type: 'move',
                      movement,
                    }),
                  }),
                )
              }
            }
          }
        }
        can.addEventListener('touchstart', touchHandler)
        can.addEventListener('touchmove', touchHandler)
        can.addEventListener('touchend', () => {
          movement.right = false
          movement.left = false
          movement.up = false
          movement.down = false
        })

        let imageArray = [] as HTMLImageElement[]
        for (i = 0; i < 25; i++) {
          const f = `${i}`.padStart(3, '0')
          imageArray.push(await loadImage(`tiles/tile${f}.png`))
        }
        console.log({ imageArray })
        bird[0] = await loadImage('img/bird1.png')
        bird[1] = await loadImage('img/bird1.png')
        catfood = await loadImage('img/catfood.jpg')

        myRenderTileSetup(ctx, can.width, can.height)
      } catch (e) {
        setError(i + ' ' + e)
      }
    })()
  }, [socket, gameStarted])

  return !socket ? (
    <h1>Loading...</h1>
  ) : error ? (
    <h1 style={{ color: 'red' }}>{`${error}`}</h1>
  ) : (
    <div className="container">
      {!gameStarted ? (
        <StartScreen
          startGame={() => {
            setGameStarted(true)
            socket.send(
              str({
                action: 'sendmessage',
                data: { type: 'newplayer', username },
              }),
            )
          }}
          username={username}
          setUsername={setUsername}
        />
      ) : (
        <canvas ref={ref} width={800} height={600} />
      )}
      <ChatMessages messages={messages} />
      <ChatForm socket={socket} />
    </div>
  )
}

function ChatForm({ socket }: { socket: WebSocket }) {
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

function ChatMessages({ messages }: { messages: Message[] }) {
  return (
    <div
      style={{
        backgroundColor: 'orange',
        color: 'green',
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

function StartScreen({
  username,
  setUsername,
  startGame,
}: {
  username: string
  setUsername: Function
  startGame: Function
}) {
  return (
    <div style={{ position: 'relative' }}>
      <input
        type="text"
        value={username}
        onChange={event => setUsername(event.target.value)}
        style={{
          fontSize: '2em',
          left: 200,
          top: 400,
          position: 'absolute',
        }}
      />
      <button
        type="submit"
        onClick={() => startGame()}
        style={{ left: 200, top: 500, position: 'absolute', fontSize: '2em' }}
      >
        Start
      </button>
      <img
        src="img/gratiot.png"
        width={800}
        height={600}
        style={{ border: '1px solid black' }}
      />
    </div>
  )
}
export default App
