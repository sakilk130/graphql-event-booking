const mongoose = require('mongoose');
const Event = require('../../models/Event');
const User = require('../../models/User');
const bcryptjs = require('bcryptjs');

const user = async (UserId) => {
  try {
    const user = await User.findById(UserId);
    return { ...user._doc, _id: user.id };
  } catch (error) {
    throw error;
  }
};

const events = async (eventIds) => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map((event) => {
      return {
        ...event._doc,
        _id: event.id,
        creator: user.bind(this, event.creator),
      };
    });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map((event) => {
        return {
          ...event._doc,
          _id: event.id,
          date: new Date(event._doc.date).toISOString(),
          creator: user.bind(this, event._doc.creator),
        };
      });
    } catch (error) {
      throw error;
    }
  },

  users: async () => {
    try {
      const users = await User.find();
      return users.map((user) => {
        return {
          ...user._doc,
          _id: user.id,
          password: null,
          createdEvents: events.bind(this, user._doc.createdEvents),
        };
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
      date: new Date(args.eventInput.date),
      creator: '613a69677ec0d65cf96aa408',
    });
    let eventCreated;

    try {
      const result = await event.save();
      eventCreated = {
        ...result._doc,
        _id: result.id,
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, result._doc.creator),
      };
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

  createUser: async (args) => {
    try {
      const creator = await User.find({ email: args.userInput.email });
      if (creator) {
        throw new Error('User already exists');
      }
      const hashedPassword = await bcryptjs.hash(args.userInput.password, 10);
      const newuser = new User({
        email: args.userInput.email,
        password: hashedPassword,
      });
      const result = await newuser.save();
      return { ...result._doc, _id: result.id };
    } catch (error) {
      throw error;
    }
  },
};
