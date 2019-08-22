const chance = require('chance')();
const { User } = require('../../app/models');

exports.createUsers = count => {
  const promises = [];
  for (let i = 0; i < count; i++) {
    const mockUser = {
      firstName: chance.first(),
      lastName: chance.last(),
      email: `mail${i}@wolox.com.ar`,
      password: chance.word({ length: 8 }) + chance.integer({ min: 0, max: 9 })
    };

    promises.push(User.createUser(mockUser));
  }
  return Promise.all(promises);
};
