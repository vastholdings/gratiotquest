import { useRef, useEffect, useState } from 'react'

import { loadImage, useLocalStorage, str } from './util'
import { getSocket } from './socket'
import ChatMessages, { Message } from './ChatMessages'
import ChatForm from './ChatForm'
import UsernameDialog from './UsernameDialog'
import StartScreen from './StartScreen'

function App() {
  const ref = useRef<HTMLCanvasElement>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [socket, setSocket] = useState<WebSocket>()
  const [error, setError] = useState<unknown>()
  const [username, setUsername] = useLocalStorage('username', '')
  const [gameStarted, setGameStarted] = useState(false)
  const [imagesLoaded, setImagesLoaded] = useState(false)

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
        const arrayWidth = 5
        const arrayHeight = 5
        const imageWidth = 2800
        const imageHeight = 1600
        const bird = [] as HTMLImageElement[]
        let offsetX = 2000
        let offsetY = 2000

        const movement = {
          up: false,
          down: false,
          left: false,
          right: false,
        }

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
        let dist = 10
        let counter = 0

        function myRenderTileSetup(
          ctx: CanvasRenderingContext2D,
          width: number,
          height: number,
        ) {
          const moving =
            movement.left || movement.right || movement.up || movement.down
          if (movement.left) {
            offsetX = Math.max(0, offsetX - dist)
          }
          if (movement.right) {
            offsetX += dist
          }
          if (movement.up) {
            offsetY = Math.max(0, offsetY - dist)
          }
          if (movement.down) {
            offsetY += dist
          }
          ctx.clearRect(0, 0, width, height)
          ctx.save()
          ctx.translate(-offsetX, -offsetY)

          for (let y = 0; y < arrayWidth; y++) {
            for (let x = 0; x < arrayHeight; x++) {
              const pos = x + y * arrayWidth
              const img = imageArray[pos]
              const xpos = (pos % arrayWidth) * imageWidth
              const ypos = Math.floor(pos / arrayWidth) * imageHeight
              ctx.drawImage(img, xpos, ypos, imageWidth, imageHeight)
            }
          }

          ctx.restore()

          ctx.drawImage(bird[Math.floor(counter) % bird.length], 400, 400)
          // // Create gradient
          const gradient = ctx.createLinearGradient(0, 0, 400, 0)
          gradient.addColorStop(Math.random(), 'magenta')
          gradient.addColorStop(Math.random(), 'blue')
          gradient.addColorStop(Math.random(), 'red')
          ctx.fillStyle = gradient
          ctx.font = 'bold 30px verdana'
          ctx.fillText(`SCORE: 0`, 100, 100)

          window.requestAnimationFrame(() =>
            myRenderTileSetup(ctx, width, height),
          )
          if (moving) {
            counter += 0.5
          }
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
        })

        function touchHandler(e: any) {
          if (!can) {
            return
          }
          if (e.touches) {
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
        for (let i = 0; i < 25; i++) {
          const f = `${i}`.padStart(3, '0')
          imageArray.push(await loadImage(`tiles/tile${f}.png`))
        }
        bird[0] = await loadImage('img/bird0.png')
        bird[1] = await loadImage('img/bird1.png')
        bird[2] = await loadImage('img/bird2.png')
        console.log('here')
        setImagesLoaded(true)

        myRenderTileSetup(ctx, can.width, can.height)
      } catch (e) {
        console.error(e)
        setError(e)
      }
    })()
  }, [socket, gameStarted])

  console.log(username, gameStarted)

  return !socket ? (
    <h1>Loading...</h1>
  ) : error ? (
    <h1 style={{ color: 'red' }}>{`${error}`}</h1>
  ) : (
    <div className="container">
      {!username ? (
        <UsernameDialog username={username} submit={arg => setUsername(arg)} />
      ) : null}
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
        />
      ) : !imagesLoaded ? (
        <h1>Loading data...</h1>
      ) : (
        <canvas ref={ref} width={800} height={600} />
      )}
      <ChatMessages messages={messages} />
      <ChatForm socket={socket} />
    </div>
  )
}

export default App
