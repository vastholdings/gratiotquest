import { useRef, useEffect, useState } from 'react'

import Link from 'next/link'

import { loadImage, send } from '../util'
import { getSocket } from '../util/socket'
import ChatMessages from '../components/ChatMessages'
import ChatForm from '../components/ChatForm'
import UsernameDialog from '../components/UsernameDialog'
import StartScreen from '../components/StartScreen'

type PlayerMap = { [key: string]: Player }
interface Player {
  x: number
  y: number
  username: string
  frame: number
}

function GearIcon() {
  return (
    <svg style={{ width: 24, height: 24 }} viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"
      />
    </svg>
  )
}

function drawScore(ctx: CanvasRenderingContext2D) {
  // Create gradient
  const gradient = ctx.createLinearGradient(0, 0, 400, 0)
  gradient.addColorStop(Math.random(), 'magenta')
  gradient.addColorStop(Math.random(), 'blue')
  gradient.addColorStop(Math.random(), 'red')
  ctx.fillStyle = gradient
  ctx.font = 'bold 30px verdana'
  ctx.fillText(`SCORE: 0`, 100, 100)
}

function AppLoading() {
  const [socket, setSocket] = useState<WebSocket>()
  const [error, setError] = useState<unknown>()

  useEffect(() => {
    ;(async () => {
      try {
        setSocket(await getSocket())
      } catch (e) {
        setError(e)
      }
    })()
  }, [])
  return !socket ? (
    <h1>Loading...</h1>
  ) : error ? (
    <h1 className="error">{`${error}`}</h1>
  ) : (
    <App socket={socket} />
  )
}

function Game({ socket, username }: { socket: WebSocket; username: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const allPlayers = useRef<PlayerMap>({})
  const offsetX = useRef(1600 + Math.random() * 100)
  const offsetY = useRef(300)

  useEffect(() => {
    function handler(event: any) {
      const obj = JSON.parse(event.data)
      const players = allPlayers.current
      const { type, username } = obj

      if (type === 'move') {
        const p = (players[username] = players[username] || obj)
        p.x = obj.x
        p.y = obj.y
        p.frame = obj.frame
      }
    }
    socket.addEventListener('message', handler)

    return () => {
      return socket.removeEventListener('message', handler)
    }
  }, [socket])

  useEffect(() => {
    let requestID: number | undefined
    ;(async () => {
      try {
        const can = ref.current
        if (!can) {
          return
        }
        const ctx = can.getContext('2d')
        if (!ctx) {
          return
        }

        // player's position
        // let playerid: any
        // let allCatfood = {} as any
        const arrayWidth = 5
        const arrayHeight = 5
        const imageWidth = 2800
        const imageHeight = 1600
        const bird = [] as HTMLImageElement[]

        const move = {
          up: false,
          down: false,
          left: false,
          right: false,
        }

        function drawPlayers(ctx: CanvasRenderingContext2D) {
          Object.values(allPlayers.current).forEach(player => {
            if (player.username !== username) {
              ctx.drawImage(
                bird[Math.floor(player.frame) || 0],
                player.x - offsetX.current + 400,
                player.y - offsetY.current + 400,
              )
            }
          })
        }

        let dist = 10
        let counter = 0

        function draw(
          ctx: CanvasRenderingContext2D,
          width: number,
          height: number,
          socket: WebSocket,
        ) {
          const moving = move.left || move.right || move.up || move.down
          if (move.left) {
            offsetX.current = Math.max(0, offsetX.current - dist)
          }
          if (move.right) {
            offsetX.current += dist
          }
          if (move.up) {
            offsetY.current = Math.max(0, offsetY.current - dist)
          }
          if (move.down) {
            offsetY.current += dist
          }

          if (moving) {
            send(socket, {
              type: 'move',
              username,
              x: offsetX,
              y: offsetY,
              frame: counter % 2,
            })
            counter += 0.5
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
          drawScore(ctx)
          drawPlayers(ctx)

          requestID = requestAnimationFrame(() =>
            draw(ctx, width, height, socket),
          )
        }

        document.addEventListener('keydown', event => {
          switch (event.key) {
            case 'ArrowLeft':
              move.left = true
              break
            case 'ArrowUp':
              move.up = true
              break
            case 'ArrowRight':
              move.right = true
              break
            case 'ArrowDown':
              move.down = true
              break

            default:
          }
        })

        document.addEventListener('keyup', event => {
          switch (event.key) {
            case 'ArrowLeft':
              move.left = false
              break
            case 'ArrowUp':
              move.up = false
              break
            case 'ArrowRight':
              move.right = false
              break
            case 'ArrowDown':
              move.down = false
              break
            default:
          }
        })

        function touchHandler(can: HTMLCanvasElement, event: TouchEvent) {
          if (!can) {
            return
          }
          if (event.touches) {
            const playerX = event.touches[0].pageX - can.offsetLeft
            const playerY = event.touches[0].pageY - can.offsetTop
            if (playerX > 420) {
              move.right = true
            }
            if (playerX < 320) {
              move.left = true
            }
            if (playerY > 340) {
              move.down = true
            }
            if (playerY < 260) {
              move.up = true
            }
          }
        }
        can.addEventListener('touchstart', event => touchHandler(can, event))
        can.addEventListener('touchmove', event => touchHandler(can, event))
        can.addEventListener('touchend', () => {
          move.right = false
          move.left = false
          move.up = false
          move.down = false
        })

        let imageArray = [] as HTMLImageElement[]
        for (let i = 0; i < 25; i++) {
          const f = `${i}`.padStart(3, '0')
          imageArray.push(await loadImage(`tiles/tile${f}.png`))
        }
        bird[0] = await loadImage('img/bird0.png')
        bird[1] = await loadImage('img/bird1.png')
        bird[2] = await loadImage('img/bird2.png')

        draw(ctx, can.width, can.height, socket)
      } catch (e) {
        console.error(e)
      }

      return () => {
        if (requestID !== undefined) {
          cancelAnimationFrame(requestID)
        }
      }
    })()
  }, [socket, username])
  return (
    <>
      <canvas ref={ref} width={800} height={600} />
      <Link href={`/edit?tile=1`}>
        <a>
          <GearIcon />
        </a>
      </Link>
    </>
  )
}

function App({ socket }: { socket: WebSocket }) {
  const [username, setUsername] = useState('')
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

export default AppLoading
