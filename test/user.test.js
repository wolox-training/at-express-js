const chance = require('chance')();
const supertest = require('supertest');
const { expect } = require('chai');
// eslint-disable-next-line no-unused-vars
const should = require('chai').should();
const bcrypt = require('bcryptjs');
const app = require('../app');
const { User } = require('../app/models');

const request = supertest(app);
const mockUser = {
  firstName: chance.first(),
  lastName: chance.last(),
  email: chance.email({ domain: 'wolox.com.ar' }),
  password: chance.word({ length: 8 }) + chance.integer({ min: 0, max: 9 })
};

describe('POST /users', () => {
  it('It should respond with code 201 when data passes validation checks', () =>
    request
      .post('/users')
      .send(mockUser)
      .then(res => {
        expect(res.status).to.equal(201);
        return User.findOne({ where: { email: mockUser.email } });
      })
      .then(user => {
        const arePasswordsEqual = bcrypt.compare(mockUser.password, user.password);
        return Promise.all([user, arePasswordsEqual]);
      })
      .then(([user, arePasswordsEqual]) => {
        // eslint-disable-next-line no-unused-expressions
        expect(arePasswordsEqual).to.be.true;
        expect(user.firstName).to.equal(mockUser.firstName);
        expect(user.lastName).to.equal(mockUser.lastName);
        expect(user.email).to.equal(mockUser.email);
      }));
});
