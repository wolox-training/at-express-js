const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../app');
const request = supertest(app);
const { runFactory, authorizationFactory } = require('./helpers');
const createUsers = runFactory('user');
const { AUTHENTICATION_ERROR } = require('../app/errors');

describe('POST /users/sessions', () => {
  it('should respond with expiration time', () =>
    createUsers(1)
      .then(([{ email }]) => request.post('/users/sessions').send({ email, password: '1234567ocho' }))
      .then(response => {
        expect(response.statusCode).to.equal(200);
        expect(response.body).to.have.property('tokenExpiresAt');
      }));

  it('should fail because token has expire', () =>
    createUsers(1)
      .then(([{ id }]) => authorizationFactory.regular(id))
      .then(
        authorization =>
          new Promise(resolve => {
            setTimeout(() => resolve(authorization), 4000);
          })
      )
      .then(authorization => request.get('/users').set(authorization))
      .then(response => {
        expect(response.statusCode).to.equal(401);
        expect(response.body.internal_code).to.equal(AUTHENTICATION_ERROR);
      }));
});
