// @ts-nocheck
const path = require('path');
const express = require('express');
const http = require('http');
const app = express();

const server = http.createServer(app);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const io = require('socket.io')(server, {
  cors: { origin: '*' },
});

const room = 'talkie';
const users = [];

io.on('connection', (socket) => {
  socket.on( 'joinRoom', ( { username, isLoggedinBefore } ) => {
    
    users.push( { id: socket.id, username } );
    
    socket.join(room);

    // Welcome current user
    const welcomeData = {
      id: 'bot',
      text:`${
        isLoggedinBefore ? 'Welcome to ChatCord!' : `${username} Welcome back`
      }`,
      time: new Date(),
    };
    socket.emit('message', welcomeData);

    // Broadcast when a user connects
    socket.broadcast.to(room).emit('message', {
      id: 'bot',
      text: `${username} has joined the chat`,
      time: new Date(),
    });
  });
  socket.on('message', (message) => {
    io.emit('message', {
      ...message,
      time: new Date(),
    });
  } );
  socket.on('disconnect', () => {
    console.log(socket.id);
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
