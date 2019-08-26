const chance = require('chance')();
const { User } = require('../../app/models');
const { hashPassword } = require('../../app/helpers');

exports.createUsers = count => {
  const createRequestArray = (arr, counting) => {
    const mockUser = {
      firstName: chance.first(),
      lastName: chance.last(),
      email: `mail${counting}@wolox.com.ar`,
      password: '1234587ocho'
    };

    const userPromise = hashPassword(mockUser).then(User.createUser);

    if (counting === 1) {
      return [...arr, userPromise];
    }
    return createRequestArray([...arr, userPromise], counting - 1);
  };

  const promises = createRequestArray([], count);
  return Promise.all(promises);
};
