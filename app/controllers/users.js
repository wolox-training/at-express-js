const logger = require('../logger');
const { hashPassword } = require('../services/encryption');
const { extractFields, paginatedResponse } = require('../serializers');
const { userSchema } = require('../schemas/userSchema');

const { getAllUsers, getUserById, createUser, createAdminUser } = require('../services/usersService');

const getUserFields = extractFields(userSchema, 'password');

exports.signUp = (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  return hashPassword({ firstName, lastName, email, password })
    .then(createUser)
    .then(result => {
      logger.info(`A user '${result.firstName}' has been created`);
      res.status(201).send({ userId: result.id });
    })
    .catch(error => {
      logger.error(error.message);
      next(error);
    });
};

exports.getUsers = (req, res, next) => {
  const { id } = req.params;
  const page = parseInt(req.query.page) || 1;
  const pageSize = req.query.pageSize || 10;
  const offset = (page - 1) * pageSize;
  const limit = parseInt(pageSize);

  const prepareResponse = paginatedResponse({
    resource: 'users',
    offset,
    limit,
    page,
    getFieldsFn: getUserFields
  });

  if (id) {
    return getUserById(id)
      .then(response => res.send(getUserFields(response)))
      .catch(next);
  }

  return getAllUsers(page, pageSize, offset, limit)
    .then(prepareResponse)
    .then(response => res.send(response))
    .catch(next);
};

exports.createAdmin = (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  const userCreatedResponse = name => {
    logger.info(`A user '${name}' has been created`);
    res.status(201).end();
  };
  const userUpdatedResponse = name => {
    logger.info(`A user '${name}' has been updated`);
    res.end();
  };

  const respond = created => (created ? userCreatedResponse() : userUpdatedResponse());

  return hashPassword({ firstName, lastName, email, password })
    .then(createAdminUser)
    .then(respond)
    .catch(next);
};
