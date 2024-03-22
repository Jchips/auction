'use strict';

const Chance = require('chance');

const chance = new Chance();

const handler = (payload, socket) => {
  let bidAmount = getRandomBid(payload.currentPrice, payload.currentPrice + 100);
  socket.emit('bid', {
    ...payload,
    buyer: chance.name(),
    bidAmount: bidAmount,
    currentPrice: bidAmount,
  });
};

/**
 * Gets a random number between the min and max parameters.
 * Code from Math.random MDN docs.
 * @param {Number} min - the number the bid shouldn't go below
 * @param {Number} max - the max number the bid should go to
 * @returns {Number} - a random integer between the max and min values
 */
function getRandomBid(min, max) {
  const minCeiled = Math.ceil(min) + 1;
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

module.exports = handler;
