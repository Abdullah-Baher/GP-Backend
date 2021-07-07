const express = require('express')
const cors =  require('cors')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server,{
  cors: {
    origin: '*',
    methods: ["GET", "POST"]
}
})

const connectedUsers = {
  3: [],
  4: []
}

app.use(cors())
io.on('connection', socket => {

  console.log("xxx");

  socket.on('join-room', (roomId, userId, user, photo) => {

    connectedUsers[roomId].map(x => { 
      console.log("X: " + roomId);
      var userId = x.userId
      var user = x.user
      var photo = x.photo
      socket.emit('connection', ({userId, user, photo}))
    })

    connectedUsers[roomId].push({ 
      userId: userId,
      user: user,
      photo: photo
    })

    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', ({userId, user, photo}))
    //io.emit('user-connected', userId);

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
      connectedUsers[roomId].splice(connectedUsers[roomId].indexOf(x => x.userId == userId));
    })
  })

  socket.on('user-disconnected', (roomId, userId) => { 
    console.log("test: " + userId);
    socket.to(roomId).broadcast.emit('user-disconnected', userId)
    for (var i = 0; i < connectedUsers[roomId].length; i++) 
      if (connectedUsers[roomId][i].userId == userId)
        connectedUsers[roomId].splice(i, 1);
  }) 
  
  
  socket.on('OffsetChanged', ({startOffset, endOffset, role}) => {
    io.emit('OffsetChanged', {startOffset, endOffset, role});
  })

  socket.on('CursorChanged', ({offset, role}) => {
    io.emit('CursorChanged', {offset, role});
  })

  socket.on('Insert', ({ index, text, role }) => {
    console.log(index + ' ' + text + " " + role);
    io.emit('Insert', { index, text, role })
  })


  socket.on('Replace', ({ index, length, text, role }) => {
    io.emit('Replace', { index, length, text, role })
  })

  socket.on('Delete', ({ index, length, role }) => {
    io.emit('Delete', { index, length, role })
  })

  
  

  socket.on('message', ({ name, message, id, photo }) => {
    console.log(name + " " + photo) 
    io.emit('message', { name, message, id, photo })
  })

})

server.listen(4000, function() {
  console.log('listening on port 4000')
})
