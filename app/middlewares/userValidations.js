const { validationError } = require('./errors');

const validateUser = user => ({
  isEmailValid: () => true,
  checkEmailDomain: domain => !!domain,
  hasRequiredFields: requiredFields => !!requiredFields,
  isAlfanumeric: () => true,
  checkLength: length => user.length >= length
});

exports.userValidation = (req, res, next) => {
  const user = req.body;
  // TODO: terminar validaciones
  if (!user) {
    return next(validationError('missing request data'));
  }

  const userValidation = validateUser(user);

  if (!userValidation.isEmailValid()) {
    next(validationError('Email is not valid'));
  }

  return next();
};
