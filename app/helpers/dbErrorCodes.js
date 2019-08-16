const { entityAlreadyExists, validationError } = require('../errors');

exports.dbErrorCodes = {
  SequelizeUniqueConstraintError: {
    message: 'The resource you are trying to create already exists',
    errorFn: entityAlreadyExists
  },
  SequelizeValidationError: {
    message: 'There has been a validation error',
    errorFn: validationError
  }
};
