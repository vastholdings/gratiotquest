'use client'
import { useRef, useEffect, useState } from 'react'
import {
  AnimatedSprite,
  Container,
  Application,
  Texture,
  Sprite,
  Assets,
} from 'pixi.js'
import ErrorMessage from './ErrorMessage'

const tileWidth = 2800
const tileHeight = 1600

async function createTileSprite() {
  const arr = [] as Sprite[][]
  for (let i = 0; i < 5; i++) {
    const arr2 = []
    for (let j = 0; j < 5; j++) {
      const texture = await Assets.load<Texture>(
        `tiles/gratiot_${i}_${j}-fs8.png`,
      )
      arr2.push(Sprite.from(texture))
    }
    arr.push(arr2)
  }
  return arr
}

async function createCharacterSprint() {
  return new AnimatedSprite(
    await Promise.all(
      ['bird0.png', 'bird1.png', 'bird2.png'].map(e =>
        Assets.load<Texture>(`img/${e}`),
      ),
    ),
  )
}

export default function Game() {
  const ref = useRef<HTMLCanvasElement>(null)
  const [error, setError] = useState<unknown>()

  useEffect(() => {
    const move = {
      left: false,
      right: false,
      up: false,
      down: false,
    }
    function keydown(event: KeyboardEvent) {
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
    }
    function keyup(event: KeyboardEvent) {
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
    }
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

        const container = new Container()
        app.stage.addChild(container)
        for (let y = 0; y < arr.length; y++) {
          for (let x = 0; x < arr[y].length; x++) {
            const tileSprite = arr[x][y]
            tileSprite.x = x * tileWidth
            tileSprite.y = y * tileHeight
            container.addChild(tileSprite)
          }
        }

        character.anchor.set(0.5)

        character.x = app.screen.width / 2
        character.y = app.screen.height / 2
        app.stage.addChild(character)

        document.addEventListener('keydown', keydown)
        document.addEventListener('keyup', keyup)
        app.ticker.add(time => {
          if (move.up || move.left || move.right || move.down) {
            character.play()
          } else {
            character.stop()
          }

          if (move.up) {
            container.y += 10 * time.deltaTime
          }
          if (move.down) {
            container.y -= 10 * time.deltaTime
          }
          if (move.left) {
            container.x += 10 * time.deltaTime
          }
          if (move.right) {
            container.x -= 10 * time.deltaTime
          }
        })
      } catch (e) {
        setError(e)
        console.error(e)
      }
    })()
    return () => {
      document.removeEventListener('keyup', keyup)
      document.removeEventListener('keydown', keydown)
    }
  }, [])
  return (
    <>
      {error ? <ErrorMessage error={error} /> : null}
      <canvas ref={ref} />
    </>
  )
}
