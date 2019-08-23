const supertest = require('supertest');
const { expect } = require('chai');
const app = require('../app');
const request = supertest(app);
const { User } = require('../app/models');
const { mockUser, mockUserOnTheFly } = require('./mocks/mockUsers');
const { FORBIDDEN_ERROR } = require('../app/errors');

describe('POST /admin/users', () => {
  it('should succeed when user has authorization (create new admin)', () =>
    request
      .post('/users')
      .send(mockUser)
      .then(() => User.update({ role: 'admin' }, { where: { email: mockUser.email } }))
      .then(() =>
        request.post('/users/sessions').send({ email: mockUser.email, password: mockUser.password })
      )
      .then(response => {
        const user = mockUserOnTheFly();
        const token = response.headers.authorization;
        return Promise.all([
          request
            .post('/admin/users')
            .send(user)
            .set({ authorization: token }),
          user,
          token
        ]);
      })
      .then(([response, user]) => {
        expect(response.statusCode).to.equal(201);
        return Promise.all([User.find({ where: { email: user.email } }), user]);
      })
      .then(([response, user]) => {
        expect(response.firstName).to.equal(user.firstName);
        expect(response.lastName).to.equal(user.lastName);
        expect(response.email).to.equal(user.email);
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
