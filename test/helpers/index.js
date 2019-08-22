const chance = require('chance')();
const supertest = require('supertest');
const app = require('../../app');
const request = supertest(app);

exports.createUsers = count => {
  const promises = [];
  for (let i = 0; i < count; i++) {
    const mockUser = {
      firstName: chance.first(),
      lastName: chance.last(),
      email: `mail${i}@wolox.com.ar`,
      password: '1234587ocho'
    };

    promises.push(request.post('/users').send(mockUser));
  }
  return Promise.all(promises);
};
