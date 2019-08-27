const logger = require('../logger');
const { databaseError } = require('../errors');
const { dbErrorCodes } = require('./index');
const { extractField } = require('../serializers');

exports.handleError = genericMessage => error => {
  logger.error(error.message);
  const { message, errorFn } = dbErrorCodes[error.name] || { message: genericMessage };
  if (errorFn) {
    throw errorFn(`${genericMessage}. ${message}`);
  }
  logger.error(message);
  throw databaseError(genericMessage);
};

exports.prepareResponse = extractField('dataValues');
