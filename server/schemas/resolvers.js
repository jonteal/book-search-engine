const { Book, User } = require('../models');

const resolvers = {
    Query: {
        book: async () => {
            return Book.find({});
        },
        users: async (parent, { _id }) => {
            const params = _id ? { _id } : {};
            return User.find(params);
        },
    },
    Mutation: {
        createUser: async (parent, args) => {
            const user = await User.create(args);
            return user;
        },
        saveBook: async (parent, args) => {
            const bookList = await User.findOneAndUpdate(
                { _id },
                { new: true }
            );
            return bookList;
        },
        login: async () => {

        },
        deleteBook: async () => {
            const bookList = await.User.findOneAndDelete(
                { _id },
                { new: true }
            );
        
        return bookList;
        }
    }
};

module.exports = resolvers;