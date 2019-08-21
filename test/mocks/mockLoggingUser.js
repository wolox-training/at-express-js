const chance = require('chance')();

const mockUser = {
  firstName: chance.first(),
  lastName: chance.last(),
  email: chance.email({ domain: 'wolox.com.ar' }),
  password: chance.word({ length: 8 }) + chance.integer({ min: 0, max: 9 })
};

const loggingUser = {
  email: mockUser.email,
  password: mockUser.password
};

exports.wrongPasswordUser = {
  ...loggingUser,
  password: chance.integer({ min: 0, max: 9 }) + chance.word({ length: 8 })
};

exports.unexistentUserNameUser = {
  ...loggingUser,
  email: chance.email({ domain: 'wolox.com.ar' })
};

exports.missingPasswordUser = {
  ...loggingUser,
  password: null
};

exports.missignEmailUser = {
  ...loggingUser,
  email: null
};

exports.wrongDomainUser = {
  ...loggingUser,
  email: chance.email({ domain: 'different.com.ar' })
};

exports.passwordTooShortUser = {
  ...loggingUser,
  password: chance.word({ length: 2 }) + chance.integer({ min: 0, max: 9 })
};

exports.wrongFormatPasswordUser = {
  ...loggingUser,
  password: chance.word({ length: 10 })
};

exports.mockUser = mockUser;
exports.loggingUser = loggingUser;
