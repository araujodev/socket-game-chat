const express = require('express');
const app = express();

const http = require('http');
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get(/^(.+)$/, (req, res) => { 
  res.sendfile( __dirname + req.params[0]); 
});

io.on('connection', (socket) => {
    socket.on('bornPlayer', (position) => {
      io.emit('newBornPlayer', { position: position, client: socket.id });
    });

    socket.on('move', (action) => {
      io.emit('newPosition', { position: action.position, client: socket.id, direction: action.direction });
    });

    socket.on('sendMessage', (msg) => {
      io.emit('broadcastMessage', { client: socket.id, msg: msg.msg, playerName: msg.playerName });
    });
  });

server.listen(3000, () => {
  console.log('listening on *:3000');
});