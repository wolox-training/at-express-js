const supertest = require('supertest');
const { expect } = require('chai');
const app = require('../app');
const request = supertest(app);
const { createUsers } = require('./helpers');
const { host, port } = require('../config').common.api;
const { AUTHENTICATION_ERROR, NOT_FOUND_ERROR } = require('../app/errors');

describe('GET /users', () => {
  it('should success when user is logged in', () =>
    createUsers(25)
      .then(() =>
        request.post('/users/sessions').send({ email: 'mail1@wolox.com.ar', password: '1234587ocho' })
      )
      .then(response => {
        const token = response.headers.authorization;
        const nextRequest = request.get('/users').set({ authorization: token });
        return Promise.all([nextRequest, token]);
      })
      .then(([response, token]) => {
        const { count, result, prev, next } = response.body;
        expect(response.statusCode).to.equal(200);
        expect(count).to.equal(25);
        expect(result.length).to.equal(10);
        expect(prev).to.equal(null);
        expect(next).to.equal(`${host}:${port}/users?page=2`);
        const nextRequest = request.get('/users?page=2').set({ authorization: token });
        return Promise.all([nextRequest, token]);
      })
      .then(([response, token]) => {
        const { count, result, prev, next } = response.body;
        expect(response.statusCode).to.equal(200);
        expect(count).to.equal(25);
        expect(result.length).to.equal(10);
        expect(prev).to.equal(`${host}:${port}/users?page=1`);
        expect(next).to.equal(`${host}:${port}/users?page=3`);

        return request.get('/users?page=3').set({ authorization: token });
      })
      .then(response => {
        const { count, result, prev, next } = response.body;
        expect(response.statusCode).to.equal(200);
        expect(count).to.equal(25);
        expect(result.length).to.equal(5);
        expect(prev).to.equal(`${host}:${port}/users?page=2`);
        expect(next).to.equal(null);
      }));

  it('should fail because user is not authenticated', () =>
    request
      .get('/users')
      .set({ authorization: 'something wrong' })
      .then(response => {
        expect(response.statusCode).to.equal(401);
        expect(response.body.internal_code).to.equal(AUTHENTICATION_ERROR);
      }));
});

describe('GET /users/:email', () => {
  it('should success when user is logged in', () =>
    createUsers(25)
      .then(() =>
        request.post('/users/sessions').send({ email: 'mail1@wolox.com.ar', password: '1234587ocho' })
      )
      .then(response => {
        const token = response.headers.authorization;
        return request.get('/users/mail2@wolox.com.ar').set({ authorization: token });
      })
      .then(response => {
        expect(response.statusCode).to.equal(200);
        expect(response.body).to.have.property('firstName');
        expect(response.body).to.have.property('lastName');
        expect(response.body).to.have.property('email');
      }));

  it('should fail because user is not authenticated', () =>
    request
      .get('/users/mail2@wolox.com.ar')
      .set({ authorization: 'something wrong' })
      .then(response => {
        expect(response.statusCode).to.equal(401);
        expect(response.body.internal_code).to.equal(AUTHENTICATION_ERROR);
      }));

  it('should fail because user requested does not exist', () =>
    createUsers(1)
      .then(() =>
        request.post('/users/sessions').send({ email: 'mail1@wolox.com.ar', password: '1234587ocho' })
      )
      .then(response => {
        const token = response.headers.authorization;
        return request.get('/users/mail2@wolox.com.ar').set({ authorization: token });
      })
      .then(response => {
        expect(response.statusCode).to.equal(404);
        expect(response.body.internal_code).to.equal(NOT_FOUND_ERROR);
      }));
});
