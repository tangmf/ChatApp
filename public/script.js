const socket = io.connect()
const messageContainer = document.getElementById('message-container')
const roomContainer = document.getElementById('room-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')
const userContainer = document.getElementById('users')

if (messageForm != null) {
  const name = prompt('What is your name?')
  socket.emit('new-user', roomName, name)
  userContainer.append(`\n ${name}`)

  messageForm.addEventListener('submit', e => {
    e.preventDefault()
    const message = messageInput.value
    appendMessage(`You: ${message}`)
    socket.emit('send-chat-message', roomName, message, name)
    messageInput.value = ''
    e.target.elements.msg.value = ''
    e.target.elements.msg.focus()
  })
}

socket.on('room-created', room => {
  const roomElement = document.createElement('div')
  roomElement.innerText = room
  const roomLink = document.createElement('a')
  roomLink.href = `/${room}`
  roomLink.innerText = 'join'
  roomContainer.append(roomElement)
  roomContainer.append(roomLink)
})

socket.on('chat-message', data => {
  appendMessage(`${data.name}: ${data.message}`)
  messageContainer.scrollTop = messageContainer.scrollHeight
})

socket.on('msg', (history, userlist) => {
  console.log("Recieved client history: " + history)
  history.forEach(element => {
    appendMessage(`${element[0]}: ${element[1]}`)
  })
    userlist.forEach(element => {
      if(element != null){
        userContainer.append(`${element}`)
      }
      
    })
  
  appendMessage('You joined')
})

socket.on('user-connected', name => {
  appendMessage(`${name} connected`)
  userContainer.append(`\n ${name}`)
})


socket.on('user-disconnected', name => {
  appendMessage(`${name} disconnected`)
})

function appendMessage(message) {
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  messageContainer.append(messageElement)
}