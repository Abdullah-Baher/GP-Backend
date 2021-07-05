const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

io.on('connection', socket => {

  console.log("xxx");

  socket.on('join-room', (roomId, userId) => {
    console.log("x: " + roomId + " " + userId);

    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId)
    //io.emit('user-connected', userId);

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })

  socket.on('user-disconnected', (roomId, userId) => { 
    console.log("test: " + userId);
    socket.to(roomId).broadcast.emit('user-disconnected', userId)
  }) 

  socket.on('OffsetChanged', ({startOffset, endOffset, role}) => {
    io.emit('OffsetChanged', {startOffset, endOffset, role});
  })

  socket.on('CursorChanged', ({offset, role}) => {
    io.emit('CursorChanged', {offset, role});
  })

  socket.on('Insert', ({ index, text, getrole }) => {
    console.log(index + ' ' + text + " " + getrole);
    io.emit('Insert', { index, text, getrole })
  })


  socket.on('Replace', ({ index, length, text, getrole }) => {
    io.emit('Replace', { index, length, text, getrole })
  })

  socket.on('Delete', ({ index, length, getrole }) => {
    io.emit('Delete', { index, length, getrole })
  })

  socket.on('message', ({ name, message, id, photo }) => {
    console.log(name + " " + photo) 
    io.emit('message', { name, message, id, photo })
  })

})

server.listen(4000, function() {
  console.log('listening on port 4000')
})