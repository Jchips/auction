'use strict';

const socket = require('../socket');
const { generateSlug } = require('random-word-slugs');
const Chance = require('chance');

const chance = new Chance();

let seller = chance.name();

socket.emit('join', `seller: ${seller}`);

function Payload() {
  this.auctionItem = generateSlug(3, { format: 'title' });
  this.seller = seller;
  this.startingPrice = Math.floor(Math.random() * 300);
  this.currentPrice = this.startingPrice;
}

const payload = new Payload();

socket.emit('new item', payload);

socket.on('accepted', (payload) => {
  console.log(`Buyer ${payload.buyer} has accepted the "${payload.auctionItem}"`);
  process.exit();
});

setTimeout(() => {
  socket.emit('auction over', { seller: payload.seller });
}, 20000);
