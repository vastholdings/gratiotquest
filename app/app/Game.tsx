'use client'
import { useRef, useEffect, useState } from 'react'
import { Application, Texture, Sprite, Assets } from 'pixi.js'
import ErrorMessage from './ErrorMessage'

const tileWidth = 2800
const tileHeight = 1600

const mapData = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
]

async function createTileSprite() {
  const arr = [] as Sprite[][]
  for (let i = 0; i < 5; i++) {
    const arr2 = []
    for (let j = 0; j < 5; j++) {
      const texture = await Assets.load<Texture>(`tiles/gratiot_${i}_${j}.png`)
      arr2.push(Sprite.from(texture))
    }
    arr.push(arr2)
  }
  return arr
}

async function createCharacterSprint() {
  const texture = await Assets.load<Texture>('img/bird0.png')
  const character = new Sprite(texture)

  return character
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
          resizeTo: window,
        })

        const arr = await createTileSprite()
        const character = await createCharacterSprint()
        for (let y = 0; y < mapData.length; y++) {
          for (let x = 0; x < mapData[y].length; x++) {
            const tileSprite = arr[x][y]
            tileSprite.x = x * tileWidth
            tileSprite.y = y * tileHeight
            app.stage.addChild(tileSprite)
          }
        }

        character.anchor.set(0.5)

        character.x = app.screen.width / 2
        character.y = app.screen.height / 2
        app.stage.addChild(character)
        app.ticker.add(time => {
          // app.stage.pivot.x += 10
          // app.stage.pivot.y += 5
          character.rotation += 0.1 * time.deltaTime
        })
      } catch (e) {
        setError(e)
        console.error(e)
      }
    })()
  }, [])
  return (
    <>
      {error ? <ErrorMessage error={error} /> : null}
      <canvas ref={ref} />
    </>
  )
}
