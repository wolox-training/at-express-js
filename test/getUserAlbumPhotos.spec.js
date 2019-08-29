const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../app');
const request = supertest(app);
const { getAlbumsPhotos } = require('./mocks/mockPhotos');
const { runFactory, authorizationFactory } = require('./helpers');
const { AUTHENTICATION_ERROR, NOT_FOUND_ERROR } = require('../app/errors');

const createAlbums = runFactory('album');

describe('GET /users/albums/:albumId/photos', () => {
  it('should success when user is authenticated and album owner', () =>
    createAlbums(1)
      .then(([{ userId, albumId }]) => {
        const authorization = authorizationFactory.regular(userId);
        getAlbumsPhotos(albumId);
        return request.get(`/users/albums/${albumId}/photos`).set(authorization);
      })
      .then(response => {
        expect(response.statusCode).to.equal(200);
        expect(response.body.length).to.equal(4);
      }));

  it('should fail because user is not autenticated', () =>
    createAlbums(1)
      .then(([{ albumId }]) => {
        getAlbumsPhotos(albumId);
        return request.get(`/users/albums/${albumId}/photos`);
      })
      .then(response => {
        expect(response.statusCode).to.equal(401);
        expect(response.body.internal_code).to.equal(AUTHENTICATION_ERROR);
      }));

  it('should fail because user is not album owner (regular user)', () =>
    createAlbums(1)
      .then(([{ userId, albumId }]) => {
        const authorization = authorizationFactory.regular(userId + 1);
        getAlbumsPhotos(albumId);
        return request.get(`/users/albums/${albumId}/photos`).set(authorization);
      })
      .then(response => {
        expect(response.statusCode).to.equal(404);
        expect(response.body.internal_code).to.equal(NOT_FOUND_ERROR);
      }));

  it('should fail because user is not album owner (admin user)', () =>
    createAlbums(1)
      .then(([{ userId, albumId }]) => {
        const authorization = authorizationFactory.admin(userId + 1);
        getAlbumsPhotos(albumId);
        return request.get(`/users/albums/${albumId}/photos`).set(authorization);
      })
      .then(response => {
        expect(response.statusCode).to.equal(404);
        expect(response.body.internal_code).to.equal(NOT_FOUND_ERROR);
      }));

  it('should fail because album does not exist', () =>
    createAlbums(1)
      .then(([{ userId, albumId }]) => {
        const authorization = authorizationFactory.admin(userId);
        getAlbumsPhotos(albumId);
        return request.get(`/users/albums/${albumId + 1}/photos`).set(authorization);
      })
      .then(response => {
        expect(response.statusCode).to.equal(404);
        expect(response.body.internal_code).to.equal(NOT_FOUND_ERROR);
      }));
});
