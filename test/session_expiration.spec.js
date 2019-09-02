const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../app');
const request = supertest(app);
const { runFactory } = require('./helpers');
const createUsers = runFactory('user');
const { FORBIDDEN_ERROR } = require('../app/errors');

describe('POST /users/sessions', () => {
  it('should respond with expiration time', () =>
    createUsers(1)
      .then(([{ email }]) => request.post('/users/sessions').send({ email, password: '1234567ocho' }))
      .then(response => {
        expect(response.statusCode).to.equal(200);
        expect(response.body).to.have.property('tokenExpiresAt');
      }));
});

describe('GET /users', () => {
  it('should fail because token has expire', () => {
    createUsers(1)
      .then(
        ([{ email }]) =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve(email);
            }, 4000);
          })
      )
      .then(email => request.post('/users/sessions').send({ email, password: '1234567ocho' }))
      .then(response => {
        expect(response.statusCode).to.equal(403);
        expect(response.body.internal_code).to.equal(FORBIDDEN_ERROR);
      });
  });
});
