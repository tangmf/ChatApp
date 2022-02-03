const socket = io.connect()
const messageContainer = document.getElementById('chat-messages')
const roomContainer = document.getElementById('room-container')
const messageForm = document.getElementById('chat-form')
const messageInput = document.getElementById('msg')
const userContainer = document.getElementById('users')
const yournameContainer = document.getElementById('your-name')
let setup = false
if (messageForm != null) {
  const name = prompt('What is your name?')
  socket.emit('new-user', roomName, name)

  messageForm.addEventListener('submit', e => {
    e.preventDefault()
    const message = messageInput.value
    appendMessage(`You: ${message}`)
    socket.emit('send-chat-message', roomName, message, name)
    messageInput.value = ''
    e.target.elements.msg.value = ''
    e.target.elements.msg.focus()
  })
  yournameContainer.innerHTML = "You: " + name;
}

window.setInterval( function(){
  if (socket.connected == false && setup == true) {
     window.location.href = '/'
     alert("You have been kicked")
  }
},10)

$(document).on('click', 'button', function() {
  {
     if(this.id.split("/")[0] == "mute"){
       alert("mute")
     }
     else if(this.id.split("/")[0] == "kick"){
      alert("kick" +  this.id.split("/")[1])
      socketId = this.id.split("/")[1]
      socket.emit('kick', (socketId)); // sent by the host
    }

  }
})



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
  
  updateusers(userlist)
  appendMessage('You joined')
  setup = true
})

socket.on('kick helper', (socketId) => { // now this socket obj is the user getting kicked
  console.log("kick helper")
  if(socket.id == socketId){
    window.location.href = '/'
    alert("you have been kicked")
  }
})

socket.on('user-connected', (name,userlist) => {
  appendMessage(`${name} connected`)
  updateusers(userlist)
})


socket.on('user-disconnected', (name,userlist) => {
  appendMessage(`${name} disconnected`)
  updateusers(userlist)
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

function updateusers(userlist){
  userContainer.innerHTML = ""
  admin = false
  for(let i = 0;i<userlist.length;i++){
    if(userlist[i].id == socket.id && userlist[i].role == 'owner'){
      admin = true;
    }
  }
  if(admin){
    userlist.forEach(element => {
      if(element != null && element.id != socket.id){
        //userContainer.innerHTML += (`<div>${element.name} <button type="button" id="kick/${element.id}">kick</button> </div>`)
        /*
        userContainer.innerHTML += (`<div class="u-container-style u-expanded-width u-group u-palette-1-base u-radius-10 u-shape-round u-group-2">
        <div class="u-container-layout u-container-layout-4">
          <button id="kick/${element.id} href="https://nicepage.com/k/interactive-website-templates" class="u-btn u-btn-round u-button-style u-gradient u-none u-radius-4 u-text-body-alt-color u-btn-2"><span class="u-file-icon u-icon u-text-white u-icon-1"><img src="images/1.png" alt=""></span>&nbsp;
          </button>
          <p class="u-text u-text-default u-text-3">${element.name}</p>
        </div>
      </div>`)
      */
      userContainer.innerHTML += (`<div class="u-container-style u-group u-palette-1-base u-radius-10 u-shape-round u-group-8"><div class="u-container-layout u-container-layout-8">
      <button id="kick/${element.id}" href="https://nicepage.com/k/interactive-website-templates" class="u-btn u-btn-round u-button-style u-gradient u-none u-radius-4 u-text-body-alt-color u-btn-3"><span class="u-file-icon u-icon u-text-white u-icon-1"><img src="images/1.png" alt=""></span>&nbsp;Kick
      </button>
      <p class="u-text u-text-default u-text-5">${element.name}</p>
    </div></div>`)
      }else{
        userContainer.innerHTML += (`<div class="u-container-style u-group u-palette-1-base u-radius-10 u-shape-round u-group-8"><div class="u-container-layout u-container-layout-8">
      <button  href="https://nicepage.com/k/interactive-website-templates" class="u-btn u-btn-round u-button-style u-gradient u-none u-radius-4 u-text-body-alt-color u-btn-3"><span class="u-file-icon u-icon u-text-white u-icon-1"><img ></span>&nbsp;
      </button>
      <p class="u-text u-text-default u-text-5">${element.name}</p>
    </div></div>`)
      }
      
    })
  }
  else{
    userlist.forEach(element => {
      if(element != null){
        //userContainer.innerHTML += (`<div>${element.name}</div>`)
        userContainer.innerHTML += (`<div class="u-container-style u-group u-palette-1-base u-radius-10 u-shape-round u-group-8"><div class="u-container-layout u-container-layout-8">
      <button  href="https://nicepage.com/k/interactive-website-templates" class="u-btn u-btn-round u-button-style u-gradient u-none u-radius-4 u-text-body-alt-color u-btn-3"><span class="u-file-icon u-icon u-text-white u-icon-1"><img ></span>&nbsp;
      </button>
      <p class="u-text u-text-default u-text-5">${element.name}</p>
    </div></div>`)
      }
      
    })
  }
  
}

function kick(userid,userlist){
  for(let i = 0;i<userlist.length;i++){
    // If given socket id is exist in list of all sockets, kill it
    if(userlist[i].id === userid)
    {
        socket.disconnect(true)
    }
  }
}


