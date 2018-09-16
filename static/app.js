/* global io, $, moment, document, localStorage, prompt, Image */

const can = document.getElementById('canvas1')
const ctx = can.getContext('2d')

// player's position
let playerid
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
let username

if (localStorage.getItem('username') === null) {
  username = prompt('Set a username')
} else {
  username = localStorage.getItem('username')
}
localStorage.setItem('username', username)

const socket = io(window.location.origin, { path: '/socket.io' })

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
    ctx.drawImage(
      catfood,
      allCatfood[p].x,
      allCatfood[p].y,
      20,
      20,
    )
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
      imageObj.onload = () => {
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
  if (e.touches) {
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
    const ts = moment(msg.created_at).format('MMMM Do YYYY, h:mm:ss a')
    $('#messages').prepend(
      $('<li>').text(`(${ts}) ${msg.username}: ${msg.msg}`),
    )
  })
})

socket.on('chat message', msg => {
  const ts = moment(msg.created_at).format('MMMM Do YYYY, h:mm:ss a')
  $('#messages').prepend($('<li>').text(`(${ts}) ${msg.username}: ${msg.msg}`))
})
$('form').submit(() => {
  socket.emit('chat message', $('#m').val())
  $('#m').val('')
  return false
})

socket.on('state', players => {
  allPlayers = res.players
})

socket.on('catfood', catfood => {
  allCatfood = catfood
})
