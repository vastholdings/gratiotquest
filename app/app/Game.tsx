'use client'
import { useRef, useEffect, useState } from 'react'
import { Application, Texture, Sprite } from 'pixi.js'
import ErrorMessage from './ErrorMessage'

const tileWidth = 32
const tileHeight = 32

const mapData = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
]

function createTileSprite() {
  const arr = []
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      arr.push(Sprite.from(Texture.from(`tiles/gratiot_${i}_${j}.png`)))
    }
  }
  return { rows: 5, cols: 5, arr }
}

export default function Game({
  socket,
  username,
}: {
  socket: WebSocket
  username: string
}) {
  const ref = useRef<HTMLCanvasElement>(null)
  const [error, setError] = useState<unknown>()

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    ;(async () => {
      try {
        if (!ref.current) {
          return
        }
        const app = new Application()
        await app.init({
          canvas: ref.current,
          width: 800,
          height: 600,
        })

        app.ticker.add(() => {
          const { arr, rows, cols } = createTileSprite()
          for (let y = 0; y < mapData.length; y++) {
            for (let x = 0; x < mapData[y].length; x++) {
              const tileSprite = arr[x * rows + y]
              tileSprite.x = x * tileWidth
              tileSprite.y = y * tileHeight
              app.stage.addChild(tileSprite)
            }
          }
        })
      } catch (e) {
        setError(e)
        console.error(e)
      }
    })()
  }, [])
  const e = error
  return e ? (
    <ErrorMessage error={e} />
  ) : (
    <canvas width={800} height={600} ref={ref} />
  )
}
