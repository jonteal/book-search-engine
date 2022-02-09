const jwt = require('jsonwebtoken');

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  // function for our authenticated routes
  authMiddleware: function ({ req }) {
    // allows token to be sent via  req.query or headers
    let token = req.body.token || req.query.token || req.headers.authorization;

    // ["Bearer", "<tokenvalue>"]
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    // If the token isn't the correct, it returns the request unchanged
    if (!token) {
      return req;
    }

    // verify token and get user data out of it
    try {

      // sets data equal to the verification testing of the token, the secret, and expiration
      const { data } = jwt.verify(token, secret, { maxAge: expiration });

      req.user = data;
    } catch {
      console.log('Invalid token');
      return res.status(400).json({ message: 'invalid token!' });
    }

    // send to next endpoint
    return req;
  },

  // Property which handles logging in and signing up. 
  signToken: function ({ username, email, _id }) {

    // Creates a payload of a username, email, and id
    const payload = { username, email, _id };

    // returns the jwt signup payload as the data, the secret, and also the expiration
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
