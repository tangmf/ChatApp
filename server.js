const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const port = process.env.PORT || 3000

app.set('views', './views')
app.set('view engine', 'html')
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
app.get('/feed',(req,res) =>{
  res.render('feed')
})
app.get('/community', (req, res) => {
  res.render('community')
})

app.get('/illness', (req, res) => {
  res.render('illness')
})

app.get('/illness_about', (req, res) => {
  res.render('illness_about')
})

app.get('/dementia', (req, res) => {
  res.render('mental-illness/dementia')
})

app.get('/test', (req, res) => {
  res.render('test')
})
app.use(express.static("images"));

app.post('/room', (req, res) => {
  if (rooms[req.body.room] != null) {
    return res.redirect('/')
  }
  roomvalue = [req.body.room, req.body.categories]
  rooms[roomvalue] = { users: {} }
  res.redirect(roomvalue)
  console.log(roomvalue)
  // Send message that new room was created
  io.emit('room-created', roomvalue)
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
const userlist = []
io.on('connection', (socket,name) => {
  client.push({id : socket.client.id})
  console.log(client)

var getClientID = client.find(e => (e.id === socket.client.id))
 console.log("the Client", getClientID)
 if(getClientID){
  //io.sockets.emit("msg",history);
  userlist.push(name)
  socket.emit("msg",history, userlist)
  console.log(history)
 }
  socket.on('new-user', (room, name) => {
    socket.join(room)
    rooms[room].users[socket.id] = name
    socket.to(room).broadcast.emit('user-connected', name)
    userlist.push(name)
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