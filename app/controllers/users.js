const { user } = require('../models');
const { hashPassword } = require('../helpers');

exports.signUp = (req, res, next) =>
  hashPassword(req.body)
    .then(hashedUser => user.create(hashedUser))
    .then(result => {
      const { firstName } = result.dataValues;
      res.send({ message: `A user "${firstName}" has been created` });
    })
    .catch(next);
