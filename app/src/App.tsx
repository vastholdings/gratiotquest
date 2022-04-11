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

function loadImage(str: string) {
  const imageObj = new Image()
  return new Promise(resolve => {
    imageObj.onload = function () {
      resolve(this)
    }
    imageObj.src = str
  })
}

const host = 'wss://kp00qnm3ma.execute-api.us-east-2.amazonaws.com/Prod/'
function App() {
  const ref = useRef<HTMLCanvasElement>(null)
  const [socket] = useState(new WebSocket(host))
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    socket.onmessage = function (event) {
      const obj = JSON.parse(event.data)
      if (obj.type === 'chat') {
        setMessages([...messages, obj])
      }
    }
  }, [])

  useEffect(() => {
    ;(async () => {
      const can = ref.current as any
      if (!can) {
        return
      }
      const ctx = can.getContext('2d') as any
      if (!ctx) {
        return
      }

      // player's position
      let playerid: any
      let allPlayers = {} as any
      let allCatfood = {} as any

      // how far offset the canvas is
      let frame = 0
      let counter = 0
      const arrayWidth = 5
      const arrayHeight = 5
      const imageWidth = 2800
      const imageHeight = 1600
      let imageArray = [] as any[]
      const bird = [] as any[]
      let catfood: any
      let gratiot: any
      let gameStarted = false
      let timer: any
      const user = localStorage.getItem('username')
      let username = user || prompt('Set a username') || ''
      localStorage.setItem('username', username)

      function draw() {
        Object.keys(allPlayers).forEach(player => {
          if (allPlayers[player].moving) {
            allPlayers[player].frame = Math.floor((counter % 8) / 4)
            counter += 1
          }
          ctx.drawImage(
            bird[allPlayers[player].frame || 0],
            allPlayers[player].x,
            allPlayers[player].y,
            100,
            100,
          )
        })

        Object.keys(allCatfood).forEach(p => {
          ctx.drawImage(catfood, allCatfood[p].x, allCatfood[p].y, 20, 20)
        })
      }

      function myRenderTileSetup() {
        if (gameStarted) {
          clearInterval(timer)
          ctx.save()
          const offsetX = allPlayers[playerid].x
          const offsetY = allPlayers[playerid].y
          ctx.translate(-offsetX + 250, -offsetY + 250)
          ctx.clearRect(0, 0, can.width, can.height)
          for (let y = 0; y < arrayWidth; y += 1) {
            for (let x = 0; x < arrayHeight; x += 1) {
              const pos = x + y * arrayWidth
              if (imageArray[pos] && imageArray[pos].complete) {
                ctx.drawImage(
                  imageArray[pos],
                  (pos % arrayWidth) * imageWidth,
                  Math.floor(pos / arrayWidth) * imageHeight,
                )
              }
            }
          }
          draw()

          ctx.restore()
          // Create gradient
          const gradient = ctx.createLinearGradient(0, 0, 400, 0)
          gradient.addColorStop(Math.random(), 'magenta')
          gradient.addColorStop(Math.random(), 'blue')
          gradient.addColorStop(Math.random(), 'red')
          ctx.fillStyle = gradient
          ctx.font = 'bold 30px verdana'
          ctx.fillText(`SCORE: ${allPlayers[playerid].score}`, 100, 100)
        } else {
          ctx.save()
          ctx.drawImage(gratiot, 0, 0, 800, 600)
          if (!timer) {
            timer = setInterval(() => {
              frame = (frame + 1) % 2
            }, 400)
          }
          ctx.restore()
        }

        window.requestAnimationFrame(myRenderTileSetup)
      }

      async function setup() {
        imageArray = await Promise.all(
          new Array(25)
            .fill(0)
            .map(i => `${i}`.padEnd(3, '0'))
            .map(i => `static/tiles/tile${i}.png`)
            .map(loadImage),
        )
        bird[0] = loadImage('static/img/bird1.png')
        bird[1] = loadImage('static/img/bird1.png')
        gratiot = loadImage('static/img/gratiot.png')
        catfood = loadImage('static/img/catfood.jpg')

        window.requestAnimationFrame(myRenderTileSetup)
      }

      const movement = {
        up: false,
        down: false,
        left: false,
        right: false,
      }
      document.addEventListener('keydown', event => {
        switch (event.keyCode) {
          case 37:
            movement.left = true
            break
          case 38:
            movement.up = true
            break
          case 39:
            movement.right = true
            break
          case 40:
            movement.down = true
            break
          case 32:
            gameStarted = true
            break
          default:
        }
        if (movement.left || movement.up || movement.right || movement.down) {
          // socket.emit('startmove')
        }
      })

      document.addEventListener('keyup', event => {
        switch (event.keyCode) {
          case 37:
            movement.left = false
            break
          case 38:
            movement.up = false
            break
          case 39:
            movement.right = false
            break
          case 40:
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
        if (!gameStarted) {
          gameStarted = true
          return
        }
        if (e.touches && can) {
          const playerX = e.touches[0].pageX - can.offsetLeft
          const playerY = e.touches[0].pageY - can.offsetTop
          if (playerX > 420) movement.right = true
          if (playerX < 320) movement.left = true
          if (playerY > 340) movement.down = true
          if (playerY < 260) movement.up = true
          if (movement.left || movement.up || movement.right || movement.down) {
            socket.send(
              str({
                action: 'sendmessage',
                data: {
                  type: 'move',
                  ...movement,
                },
              }),
            )
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
        // socket.emit('endmove')
      })

      await setup()

      // socket.emit('new player', username)

      // setInterval(() => {
      // }, 1000 / 60)

      // socket.on('initstate', data => {
      //   playerid = data
      // })

      // // socket.on('chats', data => {})

      // socket.on('chat message', msg => {})

      //     socket.on('state', players => {
      //       console.log('wow')
      //       allPlayers = players
      //     })

      //     socket.on('catfood', c => {
      //       allCatfood = c
      //     })
    })()
  }, [])
  return (
    <div>
      <div className="container">
        <canvas
          ref={ref}
          width="800"
          height="600"
          style={{ border: '1px solid black' }}
        />
        <ChatMessages messages={messages} />
      </div>
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
            data: {
              type: 'chat',
              message,
              username,
              timestamp: +Date.now(),
            },
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
        border: '1px solid black',
        height: 600,
        width: '100%',
      }}
    >
      <h3>gratiot chat</h3>
      <div
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
export default App