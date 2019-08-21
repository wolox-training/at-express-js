const { hashPassword, comparePassword } = require('./encryption');
const { dbErrorCodes } = require('./dbErrorCodes');
const { createToken, decodeToken } = require('./token');
const CONSTANTS = require('./constants');

module.exports = {
  hashPassword,
  dbErrorCodes,
  comparePassword,
  createToken,
  decodeToken,
  ...CONSTANTS
};
