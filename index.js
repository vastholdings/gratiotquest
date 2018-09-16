// Dependencies
const express = require('express')
const http = require('http')
const path = require('path')
const socketIO = require('socket.io')

const app = express()
const server = http.Server(app)
const io = socketIO(server)

const pg = require('pg')
const url = require('url')

const params = url.parse(
  process.env.DATABASE_URL ||
    'postgres://user:pass@localhost:5432/gratiotquest',
)
const auth = params.auth.split(':')

const config = {
  user: auth[0],
  password: auth[1],
  host: params.hostname,
  port: params.port,
  database: params.pathname.split('/')[1],
  ssl: true,
}
const pool = new pg.Pool(config)

app.set('port', 5000)
app.use('/static', express.static(`${__dirname}/static`))

app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, 'static/index.html'))
})

server.listen(5000)
console.log('Started on port 5000')

const players = {}
const catfood = {}
let items = 0

// Add the WebSocket handlers
io.on('connection', socket => {
  console.log('a user connected', socket.id)
  socket.on('new player', data => {
    const x = Math.floor(Math.random() * 1000) + 2000
    const y = Math.floor(Math.random() * 800) + 1000
    players[socket.id] = {
      x,
      y,
      username: data,
    }
    socket.emit('initstate', socket.id)
    pool.query('SELECT * from messages').then(res => {
      socket.emit('chats', res.rows)
    })
  })
  socket.on('movement', data => {
    const player = players[socket.id] || {}
    if (data.left) {
      player.x -= 5
    }
    if (data.up) {
      player.y -= 5
    }
    if (data.right) {
      player.x += 5
    }
    if (data.down) {
      player.y += 5
    }
  })

  socket.on('startmove', () => {
    const player = players[socket.id] || {}
    player.moving = true
  })
  socket.on('endmove', () => {
    const player = players[socket.id] || {}
    player.moving = false
  })

  socket.on('disconnect', () => {
    delete players[socket.id]
    console.log('user disconnected', socket.id)
  })
  socket.on('chat message', msg => {
    const player = players[socket.id] || {}
    pool
      .query('INSERT INTO messages(msg, username) VALUES($1, $2)', [
        msg,
        player.username,
      ])
      .then(() => {
        const obj = {
          msg,
          username: player.username,
          created_at: new Date(),
        }
        io.emit('chat message', obj)
      })
  })
})

setInterval(() => {
  io.sockets.emit('state', players)
}, 1000 / 20)

setInterval(() => {
  const x = Math.floor(Math.random() * 1000) + 2000
  const y = Math.floor(Math.random() * 800) + 1000
  items += 1
  catfood[items] = {
    x,
    y,
  }
}, 10000)
