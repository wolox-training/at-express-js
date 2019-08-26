const { hashPassword, comparePassword } = require('./encryption');
const { userSchema } = require('../schemas/userSchema');
const { dbErrorCodes } = require('./dbErrorCodes');
const { createToken, decodeToken } = require('./token');
const CONSTANTS = require('./constants');
const { matchInArray } = require('./operations');

const getUserFields = result => {
  const fields = Object.keys(userSchema).filter(field => field !== 'password');
  const prepareUser = e => fields.reduce((user, field) => ({ ...user, [field]: e[field] }), {});

  if (Array.isArray(result)) {
    return result.map(prepareUser);
  }

  return prepareUser(result);
};

module.exports = {
  hashPassword,
  dbErrorCodes,
  comparePassword,
  createToken,
  decodeToken,
  getUserFields,
  ...CONSTANTS,
  matchInArray
};
