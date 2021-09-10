const authResolver = require('./auth');
const bookingResolver = require('./bookings');
const eventResolver = require('./events');

module.exports = {
  ...authResolver,
  ...bookingResolver,
  ...eventResolver,
};
