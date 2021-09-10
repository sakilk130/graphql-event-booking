const Event = require('../../models/Event');
const Booking = require('../../models/Booking');

const { transformEvent, transformBooking } = require('./merge');

module.exports = {
  bookings: async () => {
    try {
      const bookings = await Booking.find();
      return bookings.map((booking) => {
        return transformBooking(booking);
      });
    } catch (error) {
      throw error;
    }
  },

  bookEvent: async (args) => {
    try {
      const fetchEvent = await Event.findOne({ _id: args.eventId });
      const booking = new Booking({
        user: '613a69677ec0d65cf96aa408',
        event: fetchEvent,
      });
      const result = await booking.save();
      return transformBooking(result);
    } catch (error) {
      throw error;
    }
  },

  cancelBooking: async (args) => {
    try {
      const booking = await Booking.findById(args.bookingId).populate('event');
      const event = transformEvent(booking.event);
      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (error) {
      throw error;
    }
  },
};
