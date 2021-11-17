const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const port = process.env.PORT || 3000

app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

const rooms = { }

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/search', (req, res) => {
  res.render('search', { rooms: rooms })
})

app.get('/createroom', (req, res) => {
  res.render('createroom', { rooms: rooms })
})

app.get('/blog', (req, res) => {
  res.render('blog')
})

app.get('/quiz', (req, res) => {
  res.render('quiz')
})

app.get('/game', (req, res) => {
  res.render('game')
})

app.get('/about', (req, res) => {
  res.render('about')
})

app.use(express.static("images"));

app.post('/room', (req, res) => {
  if (rooms[req.body.room] != null) {
    return res.redirect('/')
  }
  rooms[req.body.room] = { users: {} }
  res.redirect(req.body.room)
  // Send message that new room was created
  io.emit('room-created', req.body.room)
})

app.get('/:room', (req, res) => {
  if (rooms[req.params.room] == null) {
    return res.redirect('/')
  }
  res.render('room', { roomName: req.params.room })
})

server.listen(port)
const history = []
const client = []
io.on('connection', socket => {
  client.push({id : socket.client.id})
  console.log(client)

var getClientID = client.find(e => (e.id === socket.client.id))
 console.log("the Client", getClientID)
 if(getClientID){
  //io.sockets.emit("msg",history);
  socket.emit("msg",history)
  console.log(history)
 }
  socket.on('new-user', (room, name) => {
    socket.join(room)
    rooms[room].users[socket.id] = name
    socket.to(room).broadcast.emit('user-connected', name)
  })
  socket.on('send-chat-message', (room, message, name) => {
    messagearray = [name, message]
    history.push(messagearray)
    console.log(history)
    socket.to(room).broadcast.emit('chat-message', { message: message, name: rooms[room].users[socket.id] })
  })
  socket.on('disconnect', () => {
    getUserRooms(socket).forEach(room => {
      socket.to(room).broadcast.emit('user-disconnected', rooms[room].users[socket.id])
      delete rooms[room].users[socket.id]
    })
  })
})

function getUserRooms(socket) {
  return Object.entries(rooms).reduce((names, [name, room]) => {
    if (room.users[socket.id] != null) names.push(name)
    return names
  }, [])
}