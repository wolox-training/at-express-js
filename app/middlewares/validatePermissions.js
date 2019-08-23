const { forbiddenError } = require('../errors');
exports.validatePermissions = roles => (req, res, next) => {
  if (roles.includes(req.locals.role)) {
    return next();
  }
  return next(forbiddenError(`Not authorized. You must be one of: ${roles.join(', ')}`));
};
