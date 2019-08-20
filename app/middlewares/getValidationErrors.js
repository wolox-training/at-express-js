const { validationResult } = require('express-validator');
const { missingDataError, validationError } = require('../errors');

exports.getValidationErrors = (req, res, next) => {
  const { errors } = validationResult(req);
  const missingFields = errors.filter(e => e.msg === 'missing_field');

  if (missingFields.length) {
    const message = `missing required fields: ${missingFields.map(e => e.param).join(', ')}`;
    return next(missingDataError(message));
  }

  if (errors.length) {
    const message = errors.map(e => e.msg).join('. ');
    return next(validationError(message));
  }

  return next();
};
