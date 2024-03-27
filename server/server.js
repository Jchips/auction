'use strict';

require('dotenv').config();
const { Server } = require('socket.io');

const PORT = process.env.PORT || 3002;
const server = new Server();
const date = new Date();
let payloadState = null;

const auction = server.of('/auction');

auction.on('connection', (socket) => {
  console.log('Socket connected to auction namespace!', socket.id);

  socket.onAny((event, payload) => logger(event, payload));

  socket.on('join', (room) => {
    socket.join(room);
    console.log(`${socket.id} joined the room for ${room}`);
  });

  socket.on('new item', (payload) => {
    socket.broadcast.emit('new item', payload);
  });

  socket.on('bid', (payload) => {
    payloadState = payload;
    auction.to(`seller: ${payload.seller}`).emit('bid', payload);
  });

  socket.on('auction over', (payload) => {
    socket.to(`seller: ${payload.seller}`).emit('auction over', payloadState);
  });

  socket.on('accepted', (payload) => {
    socket.to(`seller: ${payload.seller}`).emit('accepted', payload);
  });
});

/**
 * Logs every event to the console.
 * @param {String} event - the event that is being logged
 * @param {Object} payload - the payload (order data)
 */
function logger(event, payload) {
  console.log('EVENT:', { event, time: date, payload });
}

console.log(`listening on PORT ${PORT}`);

server.listen(PORT);
