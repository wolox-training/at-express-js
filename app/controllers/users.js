const logger = require('../logger');
const { User } = require('../models');
const { hashPassword, comparePassword } = require('../helpers');

exports.signUp = (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  return hashPassword({ firstName, lastName, email, password })
    .then(hashedUser => User.createUser(hashedUser))
    .then(result => {
      logger.info(`A user '${result.dataValues.firstName}' has been created`);
      res.status(201).end();
    })
    .catch(error => {
      logger.error(error.message);
      next(error);
    });
};

exports.signIn = (req, res, next) => {
  const { email, password } = req.body;
  const sentUser = { email, password };

  return User.findOne({ where: { email } })
    .then(response => {
      const user = response && response.dataValues;
      if (!user) {
        next('error');
      }
      return comparePassword({ user, sentUser });
    })
    .then(user => {
      res.send({ user });
    })
    .catch(next);
};
