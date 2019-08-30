const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../app');
const request = supertest(app);
const { authorizationFactory } = require('./helpers');
const { Session } = require('../app/models');
const { AUTHENTICATION_ERROR } = require('../app/errors');

describe('POST /users/sessions/invalidate_all', () => {
  it('should success when user is signed in', () =>
    authorizationFactory
      .regular(1)
      .then(authorization => request.post('/users/sessions/invalidate_all').set(authorization))
      .then(response => {
        expect(response.statusCode).to.equal(204);
        return Session.findAndCountAll({ where: { userId: 1 } });
      })
      .then(result => {
        expect(result.count).to.equal(0);
      }));

  it('should fail because user is not authenticated', () =>
    request.post('/users/sessions/invalidate_all').then(response => {
      expect(response.statusCode).to.equal(401);
      expect(response.body.internal_code).to.equal(AUTHENTICATION_ERROR);
    }));
});
