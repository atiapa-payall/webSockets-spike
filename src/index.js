import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';

const app =  express();
const server = createServer(app);
const PORT = 3000;
const io = new Server(server);

app.use(express.static('static'));
app.get('/', (req, res) => {
  res.sendFile(new URL('../static/public/index.html', import.meta.url).pathname);
});

io.on('connection', (socket) => {
  const userMsg = `User connected ${socket.handshake.auth.username}`;
  io.emit('user-action', userMsg);

  socket.on('chat message', (msg, username) => {
    socket.broadcast.emit('chat message', msg, username);
  });

  socket.on('user-typing', (event, user) => {
    socket.broadcast.emit('user-typing', event, user);
  });

  socket.on('disconnect', () => {
    const userMsg = `User disconnected ${socket.handshake.auth.username}`;
    socket.broadcast.emit('user-action', userMsg);
  });
});

server.listen(PORT, () => {
  console.log(`server running at http://localhost/${PORT}`);
});