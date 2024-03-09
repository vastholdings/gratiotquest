import { useRef, useEffect } from 'react'

import Link from 'next/link'

import { loadImage, send } from '../util'
import GearIcon from '../components/icons/Gear'

type PlayerMap = Record<string, Player>

interface Player {
  x: number
  y: number
  username: string
  frame: number
}

function drawScore(ctx: CanvasRenderingContext2D) {
  const gradient = ctx.createLinearGradient(0, 0, 400, 0)
  gradient.addColorStop(Math.random(), 'magenta')
  gradient.addColorStop(Math.random(), 'blue')
  gradient.addColorStop(Math.random(), 'red')
  ctx.fillStyle = gradient
  ctx.font = 'bold 30px verdana'
  ctx.fillText(`SCORE: 0`, 100, 100)
}

export default function Game({
  socket,
  username,
}: {
  socket: WebSocket
  username: string
}) {
  const ref = useRef<HTMLCanvasElement>(null)
  const allPlayers = useRef<PlayerMap>({})
  const offsetX = useRef(1600 + Math.random() * 100)
  const offsetY = useRef(300)

  useEffect(() => {
    function handler(event: { data: string }) {
      const obj = JSON.parse(event.data) as {
        type: 'move'
        x: number
        y: number
        frame: number
        username: string
      }
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

    return () => socket.removeEventListener('message', handler)
  }, [socket])

  useEffect(() => {
    let requestID: number | undefined
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
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

        const dist = 10
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
          ctx.translate(-offsetX.current, -offsetY.current)

          for (let y = 0; y < arrayWidth; y++) {
            for (let x = 0; x < arrayHeight; x++) {
              const img = imageArray[x][y]
              const xpos = x * imageWidth
              const ypos = y * imageHeight
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
              event.preventDefault()
              move.left = true
              break
            case 'ArrowUp':
              event.preventDefault()
              move.up = true
              break
            case 'ArrowRight':
              event.preventDefault()
              move.right = true
              break
            case 'ArrowDown':
              event.preventDefault()
              move.down = true
              break

            default:
          }
        })

        document.addEventListener('keyup', event => {
          switch (event.key) {
            case 'ArrowLeft':
              event.preventDefault()
              move.left = false
              break
            case 'ArrowUp':
              event.preventDefault()
              move.up = false
              break
            case 'ArrowRight':
              event.preventDefault()
              move.right = false
              break
            case 'ArrowDown':
              event.preventDefault()
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

        const imageArray = [] as HTMLImageElement[][]
        for (let i = 0; i < 5; i++) {
          const arr = []
          for (let j = 0; j < 5; j++) {
            arr.push(await loadImage(`tiles/gratiot_${i}_${j}.png`))
          }
          imageArray.push(arr)
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
        <GearIcon />
      </Link>
    </>
  )
}
