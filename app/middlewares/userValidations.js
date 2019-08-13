const { validationError } = require('../errors');
const logger = require('../logger');
const { validations } = require('../helpers');

const requiredFields = ['firstName', 'lastName', 'email', 'password'];
const emailDomain = 'wolox.com.ar';
const formats = [/[0-9]/, /[a-zA-Z]/];
const minLength = 8;
const handleError = next => message => {
  logger.error(message);
  return next(validationError(message));
};

exports.userValidation = (req, res, next) => {
  const { checkMissingFields, isEmailValid, checkEmailDomain, isFormatValid, checkMinLength } = validations(
    req.body
  );
  const missingFields = checkMissingFields(requiredFields);
  const error = handleError(next);

  if (missingFields) {
    error(`missing required fields: ${missingFields.join(', ')}`);
  }

  if (!isEmailValid()) {
    error('Email is not valid');
  }

  if (!checkEmailDomain(emailDomain)) {
    error(`The email must be @${emailDomain}`);
  }
  if (!isFormatValid('password', formats)) {
    error('Password format invalid');
  }

  if (!checkMinLength(minLength)) {
    error(`Password must be at least ${minLength} characters`);
  }

  return next();
};
