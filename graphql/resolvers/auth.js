const User = require('../../models/User');
const bcryptjs = require('bcryptjs');
const { events } = require('./merge');
const jwt = require('jsonwebtoken');

module.exports = {
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

  login: async ({ email, password }) => {
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        throw new Error('User does not exist');
      }
      const isMatch = await bcryptjs.compare(password, user.password);
      if (!isMatch) {
        throw new Error('Password is incorrect');
      }
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        'private-key',
        {
          expiresIn: '1h',
        }
      );
      return { userId: user._id, token: token, tokenExpiration: 1 };
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
