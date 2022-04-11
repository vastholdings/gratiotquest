import { useRef, useEffect } from 'react'

import { format } from 'date-fns'

function App() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    /* global io, $, format, document, localStorage, prompt, Image */

    const can = ref.current
    if (!can) {
      return
    }
    const ctx = can.getContext('2d')
    if (!ctx) {
      return
    }

    // player's position
    let playerid: number | undefined
    let allPlayers = {}
    let allCatfood = {}

    // how far offset the canvas is
    let frame = 0
    let counter = 0
    const arrayWidth = 5
    const arrayHeight = 5
    const imageWidth = 2800
    const imageHeight = 1600
    let imageArray = []
    const bird = []
    let catfood
    let gratiot
    let gameStarted = false
    let timer
    const user = localStorage.getItem('username')
    let username = user || prompt('Set a username') || ''
    localStorage.setItem('username', username)

    // const socket = io(window.location.origin, { path: '/socket.io' })

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

    // stackoverflow
    function pad(input, width, z = '0') {
      const n = `${input}`
      return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n
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

    function setup() {
      const imagesLoading = []
      const images = []
      for (let i = 0; i < 25; i += 1) {
        images[i] = `static/tiles/tile${pad(i, 3)}.png`
      }
      images.push('static/img/bird0.png')
      images.push('static/img/bird1.png')
      images.push('static/img/gratiot.png')
      images.push('static/img/catfood.jpg')

      for (let i = 0; i < images.length; i += 1) {
        const imageObj = new Image()
        imagesLoading[i] = new Promise(resolve => {
          imageObj.onload = function () {
            resolve(this)
          }
          imageObj.src = images[i]
        })
      }

      Promise.all(imagesLoading).then(res => {
        imageArray = res
        bird[0] = imageArray[25]
        bird[1] = imageArray[26]
        gratiot = imageArray[27]
        catfood = imageArray[28]

        window.requestAnimationFrame(myRenderTileSetup)
      })
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
        socket.emit('startmove')
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
      if (!movement.left && !movement.up && !movement.right && !movement.down) {
        socket.emit('endmove')
      }
    })

    function touchHandler(e) {
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
          socket.emit('startmove')
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
      socket.emit('endmove')
    })

    setup()

    socket.emit('new player', username)

    setInterval(() => {
      socket.emit('movement', movement)
    }, 1000 / 60)

    socket.on('initstate', data => {
      playerid = data
    })

    socket.on('chats', data => {
      data.forEach(msg => {
        const ts = format(msg.created_at).format('MMMM Do YYYY, h:mm:ss a')
        $('#messages').prepend(
          $('<li>').text(`(${ts}) ${msg.username}: ${msg.msg}`),
        )
      })
    })

    socket.on('chat message', msg => {
      const ts = format(msg.created_at).format('MMMM Do YYYY, h:mm:ss a')
      $('#messages').prepend(
        $('<li>').text(`(${ts}) ${msg.username}: ${msg.msg}`),
      )
    })
    $('form').submit(() => {
      socket.emit('chat message', $('#m').val())
      $('#m').val('')
      return false
    })

    socket.on('state', players => {
      console.log('wow')
      allPlayers = players
    })

    socket.on('catfood', c => {
      allCatfood = c
    })
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
        <div>
          <ul
            id="messages"
            style={{
              display: 'flex',
              flexDirection: 'column-reverse',
              backgroundColor: 'orange',
              color: 'green',
              border: '1px solid black',
              height: 600,
            }}
          >
            <li style={{ fontSize: 22, padding: 20, width: 800 }}>
              gratiot chat
            </li>
          </ul>
        </div>
      </div>

      <form>
        <input id="m" autocomplete="off" />
        <button>Send</button>
      </form>
    </div>
  )
}
export default App
