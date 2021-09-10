const Event = require('../../models/Event');
const User = require('../../models/User');
const Booking = require('../../models/Booking');
const { dateToString } = require('../../helpers/date');
const { transformEvent } = require('./merge');

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map((event) => {
        return transformEvent(event);
      });
    } catch (error) {
      throw error;
    }
  },

  createEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated');
    }
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: dateToString(args.eventInput.date),
      creator: req.userId,
    });
    let eventCreated;

    try {
      const result = await event.save();
      eventCreated = transformEvent(result);
      const user = await User.findById(req.userId);

      if (!user) {
        throw new Error('User not found');
      }
      user.createdEvents.push(event);
      await user.save();

      console.log(eventCreated);

      return eventCreated;
    } catch (error) {
      throw error;
    }
  },
};
