const supertest = require('supertest');
const { expect } = require('chai');
const app = require('../app');
const request = supertest(app);
const { createUsers, createAlbums } = require('./helpers');
const { AUTHENTICATION_ERROR, FORBIDDEN_ERROR } = require('../app/errors');
const { authorizationFactory } = require('./helpers');

const checkSuccessfulResponse = response => {
  expect(response.statusCode).to.equal(200);
  expect(response.body.length).to.equal(5);
  response.body.forEach(item => {
    expect(item).to.have.property('userId');
    expect(item).to.have.property('albumId');
    expect(item).to.have.property('uri');
  });
};

describe('GET /users/:userId/albums', () => {
  it('should succeed when user is authenticated and requested user exists', () =>
    Promise.all([createUsers(1), createAlbums(5)])
      .then(() => request.get('/users/1/albums').set(authorizationFactory.regular(1)))
      .then(checkSuccessfulResponse));

  it('should fail because user is not authenticated', () =>
    Promise.all([createUsers(1), createAlbums(5)])
      .then(() => request.get('/users/1/albums'))
      .then(response => {
        expect(response.statusCode).to.equal(401);
        expect(response.body.internal_code).to.equal(AUTHENTICATION_ERROR);
      }));

  it('should fail because user does not have permission when user requested is different from user logged', () =>
    Promise.all([createUsers(2), createAlbums(5)])
      .then(() => request.get('/users/1/albums').set(authorizationFactory.regular(2)))
      .then(response => {
        expect(response.statusCode).to.equal(403);
        expect(response.body.internal_code).to.equal(FORBIDDEN_ERROR);
      }));

  it('should succeed because user is admin when user requested is different from user logged', () =>
    Promise.all([createUsers(2), createAlbums(5)])
      .then(() => request.get('/users/1/albums').set(authorizationFactory.admin(2)))
      .then(checkSuccessfulResponse));
});
