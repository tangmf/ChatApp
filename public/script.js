const socket = io.connect()
const messageContainer = document.getElementById('chat-messages')
const roomContainer = document.getElementById('room-container')
const messageForm = document.getElementById('chat-form')
const messageInput = document.getElementById('msg')
const userContainer = document.getElementById('users')

if (messageForm != null) {
  const name = prompt('What is your name?')
  socket.emit('new-user', roomName, name)
  userContainer.innerHTML += (`<div> ${name}</div>`)

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
        userContainer.innerHTML += (`<div>${element}</div>`)
      }
      
    })
  
  appendMessage('You joined')
})

socket.on('user-connected', name => {
  appendMessage(`${name} connected`)
  userContainer.innerHTML += (`<div>${name}</div>`)
})


socket.on('user-disconnected', name => {
  appendMessage(`${name} disconnected`)
})

function appendMessage(message) {
  /*
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  messageContainer.append(messageElement)
  */
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('text');
  p.innerText = message;
  div.appendChild(p);
  document.querySelector('#chat-messages').appendChild(div);
}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});

// speech recognition
var speechRecognition = window.webkitSpeechRecognition

var recognition = new speechRecognition()

var textbox = $("#textbox")

var instructions = $(#instructions)

var content = ''

recognition.continuous = true

//recognition started

recognition.onstart = function(){
  instructions.text("Voice recognition is on")
}

$("#start-btn").click(function(event){
  if(content.length){
    content += ''
  }

  recognition.start()
})