const supertest = require('supertest');
const { expect } = require('chai');
const app = require('../app');
const request = supertest(app);
const { createToken } = require('../app/helpers');
const { getAlbum, notFoundAlbum } = require('./mocks/mockAlbums');
const { AUTHENTICATION_ERROR, EXTERNAL_API_ERROR, ENTITY_ALREADY_EXISTS } = require('../app/errors');
const { REGULAR_ROLE } = require('../app/helpers');
const { Album } = require('../app/models');
const albumId = 1;
const userId = 15;
const token = createToken({ userId, role: REGULAR_ROLE });

describe('POST /albums/:id', () => {
  it('should succeed when user is authenticated and has not bought the album already', () => {
    getAlbum(albumId);
    return request
      .post(`/albums/${albumId}`)
      .send({})
      .set({ authorization: token })
      .then(response => {
        expect(response.statusCode).to.equal(201);
        return Album.findOne({ where: { albumId, userId } });
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
      .set({ authorization: 'invalid' })
      .then(response => {
        expect(response.statusCode).to.equal(401);
        expect(response.body.internal_code).to.equal(AUTHENTICATION_ERROR);
      }));

  it('should fail because album does not exists in provider', () => {
    notFoundAlbum(albumId);
    return request
      .post(`/albums/${albumId}`)
      .send({})
      .set({ authorization: token })
      .then(response => {
        expect(response.statusCode).to.equal(502);
        expect(response.body.internal_code).to.equal(EXTERNAL_API_ERROR);
      });
  });

  it('should fail because the album was already bought', () => {
    getAlbum(albumId);
    Album.create({ albumId, userId });
    return request
      .post(`/albums/${albumId}`)
      .send({})
      .set({ authorization: token })
      .then(response => {
        expect(response.statusCode).to.equal(422);
        expect(response.body.internal_code).to.equal(ENTITY_ALREADY_EXISTS);
      });
  });
});
