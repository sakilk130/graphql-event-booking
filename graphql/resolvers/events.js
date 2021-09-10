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

  createEvent: async (args) => {
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: dateToString(args.eventInput.date),
      creator: '613a69677ec0d65cf96aa408',
    });
    let eventCreated;

    try {
      const result = await event.save();
      eventCreated = transformEvent(result);
      const user = await User.findById('613a69677ec0d65cf96aa408');

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
