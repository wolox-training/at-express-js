const supertest = require('supertest');
const { expect } = require('chai');
const app = require('../app');
const request = supertest(app);
const { User } = require('../app/models');
const { mockUser, mockUserOnTheFly } = require('./mocks/mockUsers');
const { FORBIDDEN_ERROR } = require('../app/errors');
const { createToken } = require('../app/helpers');
const { createUsers } = require('./helpers');

describe('POST /admin/users', () => {
  it('should succeed when user has authorization (create new admin)', () =>
    createUsers(1)
      .then(result => {
        const token = createToken({ email: result[0].email, role: 'admin' });
        return request
          .post('/admin/users')
          .send(mockUser)
          .set({ authorization: token });
      })
      .then(response => {
        expect(response.statusCode).to.equal(201);
        return User.find({ where: { email: mockUser.email } });
      })
      .then(response => {
        expect(response.firstName).to.equal(mockUser.firstName);
        expect(response.lastName).to.equal(mockUser.lastName);
        expect(response.email).to.equal(mockUser.email);
        expect(response.role).to.equal('admin');
      }));

  it('should fail because user is not authorized', () =>
    request
      .post('/users')
      .send(mockUser)
      .then(() =>
        request.post('/users/sessions').send({ email: mockUser.email, password: mockUser.password })
      )
      .then(response =>
        request
          .post('/admin/users')
          .send(mockUserOnTheFly())
          .set({ authorization: response.headers.authorization })
      )
      .then(response => {
        expect(response.statusCode).to.equal(403);
        expect(response.body.internal_code).to.equal(FORBIDDEN_ERROR);
      }));
});
