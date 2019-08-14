const logger = require('../logger');
const { User } = require('../models');
const { hashPassword } = require('../helpers');

exports.signUp = (req, res, next) =>
  hashPassword(req.body)
    .then(hashedUser => User.createUser(hashedUser))
    .then(result => {
      const { firstName } = result.dataValues;
      const message = `A user '${firstName}' has been created`;
      logger.info(message);
      res.send({ message });
    })
    .catch(error => {
      logger.error(error.message);
      next(error);
    });
