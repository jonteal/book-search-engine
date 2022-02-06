const { User } = require('../models');

const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            return User.findOne({ _id: userId });
        },
    },

    Mutation: {
        createUser: async (parent, { user, email, password }) => {
            const user = await User.create({ user, email, password });
            const token = signToken(user);
            return { token, user };
        },
        saveBook: async (parent, { bookData }, context) => {
            if(context.user) {
                return await User.findOneAndUpdate(
                    { _id: context.user._id},
                    {
                        $addToSet: { savedBooks: bookData },
                    },
                    {
                        new: true,
                    }
                );
            }
        },
        login: async (
            parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('No user with this email exists');
            }

            const correctPassword = await user.isCorrectPassword(password);

            if (!correctPassword) {
                throw new AuthenticationError('Incorrect password!');
            }

            const token = signToken(user);
            return { token, user };

        },

        deleteBook: async (parent,{ bookId }, context) => {
            if (context.user) {
                return await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId } } },
                    { new: true }
                );
            }
        }
    }
};

module.exports = resolvers;