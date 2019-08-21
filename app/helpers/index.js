const { userSchema } = require('../schemas/userSchema');
const { hashPassword, comparePassword } = require('./encryption');
const { dbErrorCodes } = require('./dbErrorCodes');
const CONSTANTS = require('./constants');

module.exports = {
  hashPassword,
  dbErrorCodes,
  userSchema,
  comparePassword,
  ...CONSTANTS
};
