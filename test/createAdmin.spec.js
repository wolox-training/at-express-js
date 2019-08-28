const supertest = require('supertest');
const { expect } = require('chai');
const app = require('../app');
const request = supertest(app);
const { User } = require('../app/models');
const { mockUser } = require('./mocks/mockUsers');
const { FORBIDDEN_ERROR } = require('../app/errors');
const { createToken, ADMIN_ROLE, REGULAR_ROLE } = require('../app/helpers');
const { runFactory } = require('./helpers');
const createUsers = runFactory('user');
describe('POST /admin/users', () => {
  it('should succeed when user has authorization (create new admin)', () =>
    createUsers(1)
      .then(result => {
        const token = createToken({ email: result[0].email, role: ADMIN_ROLE });
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
        expect(response.role).to.equal(ADMIN_ROLE);
      }));

  it('should succeed when user has authorization (update existing user)', () =>
    createUsers(2)
      .then(([user, userToUpdate]) => {
        const token = createToken({ email: user.email, role: ADMIN_ROLE });
        return Promise.all([
          request
            .post('/admin/users')
            .send({ ...mockUser, email: userToUpdate.email })
            .set({ authorization: token }),
          userToUpdate
        ]);
      })
      .then(([response, userToUpdate]) => {
        expect(response.statusCode).to.equal(200);
        return User.find({ where: { email: userToUpdate.email } });
      })
      .then(response => {
        expect(response.role).to.equal(ADMIN_ROLE);
      }));

  it('should fail because user is not authorized', () =>
    createUsers(1)
      .then(result =>
        request
          .post('/admin/users')
          .send(mockUser)
          .set({ authorization: createToken({ email: result[0].email, role: REGULAR_ROLE }) })
      )
      .then(response => {
        expect(response.statusCode).to.equal(403);
        expect(response.body.internal_code).to.equal(FORBIDDEN_ERROR);
      }));
});
