const supertest = require('supertest');
const { expect } = require('chai');
const app = require('../app');
const request = supertest(app);
const { getAlbum, notFoundAlbum } = require('./mocks/mockAlbums');
const { AUTHENTICATION_ERROR, NOT_FOUND_ERROR, ENTITY_ALREADY_EXISTS } = require('../app/errors');
const { UserAlbum } = require('../app/models');
const { authorizationFactory } = require('./helpers');
const albumId = 1;
const userId = 15;

describe('POST /albums/:id', () => {
  it('should succeed when user is authenticated and has not bought the album already', () => {
    getAlbum(albumId);
    return authorizationFactory
      .regular(userId)
      .then(authorization =>
        request
          .post(`/albums/${albumId}`)
          .send({})
          .set(authorization)
      )
      .then(response => {
        expect(response.statusCode).to.equal(201);
        return UserAlbum.findOne({ where: { albumId, userId } });
      })
      .then(album => {
        expect(album.albumId).to.equal(albumId);
        expect(album.userId).to.equal(userId);
      });
  });

  it('should fail because user is not authenticated', () =>
    request
      .post(`/albums/${albumId}`)
      .send({})
      .set(authorizationFactory.invalid)
      .then(response => {
        expect(response.statusCode).to.equal(401);
        expect(response.body.internal_code).to.equal(AUTHENTICATION_ERROR);
      }));

  it('should fail because album does not exists', () => {
    notFoundAlbum(albumId);
    return authorizationFactory
      .regular(userId)
      .then(authorization =>
        request
          .post(`/albums/${albumId}`)
          .send({})
          .set(authorization)
      )
      .then(response => {
        expect(response.statusCode).to.equal(404);
        expect(response.body.internal_code).to.equal(NOT_FOUND_ERROR);
      });
  });

  it('should fail because the album was already bought', () => {
    getAlbum(albumId);
    return UserAlbum.create({ albumId, userId })
      .then(() => authorizationFactory.regular(userId))
      .then(authorization =>
        request
          .post(`/albums/${albumId}`)
          .send({})
          .set(authorization)
      )
      .then(response => {
        expect(response.statusCode).to.equal(422);
        expect(response.body.internal_code).to.equal(ENTITY_ALREADY_EXISTS);
      });
  });
});
