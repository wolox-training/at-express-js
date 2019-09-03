const { entityAlreadyExists, validationError } = require('../errors');
const { alreadyExistsErrorMessage, validationErrorMessage } = require('../templates/constants');

exports.dbErrorCodes = {
  SequelizeUniqueConstraintError: {
    message: alreadyExistsErrorMessage,
    errorFn: entityAlreadyExists
  },
  SequelizeValidationError: {
    message: validationErrorMessage,
    errorFn: validationError
  }
};
