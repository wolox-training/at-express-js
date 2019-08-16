const logger = require('../logger');
const { User } = require('../models');
const { hashPassword } = require('../helpers');

exports.signUp = (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  return hashPassword({ firstName, lastName, email, password })
    .then(hashedUser => User.createUser(hashedUser))
    .then(result => {
      logger.info(`A user '${result.dataValues.firstName}' has been created`);
      res.status(201).send();
    })
    .catch(error => {
      logger.error(error.message);
      next(error);
    });
};
