const logger = require('../logger');
const { User } = require('../models');
const { hashPassword, createToken } = require('../helpers');

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

exports.signIn = (req, res) => {
  const { email } = req.body;
  const token = createToken(email);
  res.send({ token }).end();
};
