'use strict';

const socket = require('../socket');
const handler = require('./buyer-handler');

socket.on('new item', (payload) => {
  console.log(`${payload.seller} is selling a "${payload.auctionItem}" starting at $${payload.startingPrice}`);
  socket.emit('join', `seller: ${payload.seller}`);
  handler(payload, socket);
});

socket.on('bid', (payload) => {
  console.log(`${payload.buyer} just bidded $${payload.bidAmount} on a "${payload.auctionItem}" from ${payload.seller}`);
  setTimeout(() => {
    handler(payload, socket);
  }, 5000);
});

socket.on('auction over', (payload) => {
  console.log(`The "${payload.auctionItem}" by seller ${payload.seller} SOLD to ${payload.buyer} at $${payload.currentPrice}`);
  socket.removeAllListeners('bid');
  socket.emit('accepted', payload);
  process.exit();
});
