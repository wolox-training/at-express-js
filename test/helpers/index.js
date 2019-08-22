const chance = require('chance')();
const supertest = require('supertest');
const app = require('../../app');
const request = supertest(app);

exports.createUsers = count => {
  const createArray = (arr, counting) => {
    const mockUser = {
      firstName: chance.first(),
      lastName: chance.last(),
      email: `mail${counting}@wolox.com.ar`,
      password: '1234587ocho'
    };

    if (counting === 1) {
      return [...arr, request.post('/users').send(mockUser)];
    }
    return createArray([...arr, request.post('/users').send(mockUser)], counting - 1);
  };

  const promises = createArray([], count);
  return Promise.all(promises);
};
