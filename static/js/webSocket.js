import { io } from 'https://cdn.socket.io/4.4.1/socket.io.esm.min.js';

let username =  'El pepe enmascarado';
const socket = io('http://localhost:3000', {
  auth: {
    username: username
  }
});
const form = document.getElementById('form');
const input = document.getElementById('input');
const chatState= document.getElementById('chat-state');
const messages = document.getElementById('messages');
const userForm = document.getElementById('userForm');
const nickInput = document.getElementById('nick-name');
let writed = false;

const handlerChatState = (e, user) => {
  if(e !== '' && !writed) {
    chatState.innerHTML = `${user} is typing...`;
    writed = true;
  } else if (e === '' && writed) {
    chatState.innerHTML = 'state';
    writed = false;
  }
};

input.addEventListener('input', (e) => {
  socket.emit('user-typing', e.target.value, username);
});

userForm.addEventListener('submit', (event) => {
  event.preventDefault();
  username = nickInput.value;
});
    
form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (input.value) {
    const item = document.createElement('li');
    item.textContent = input.value;

    socket.emit('chat message', input.value, username);
    socket.emit('user-typing', '')
    messages.appendChild(item);
    input.value = '';
  }
});


socket.on('chat message', (msg, user) => {
  const item = document.createElement('li');
  item.textContent = `${user}: ${msg}`;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

socket.on('user-action', (msg) => {
  const item = document.createElement('li');
  item.textContent = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

socket.on('user-typing', (event, user)=> {
  handlerChatState(event, user);
});