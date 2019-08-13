const { user } = require('../models');
const { hashPassword } = require('../helpers');

exports.signUp = (req, res, next) =>
  hashPassword(req.body)
    .then(hashedUser => user.create(hashedUser))
    .then(result => {
      const { id } = result.dataValues;
      res.send({ message: `created new user with id: ${id}`, id });
    })
    .catch(next);
