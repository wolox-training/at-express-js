const supertest = require('supertest');
const { expect } = require('chai');
const bcrypt = require('bcryptjs');
const app = require('../app');
const { User } = require('../app/models');
const {
  alreadyExistsErrorMessage,
  invalidPasswordLengthMessage,
  invalidPasswordMessage,
  invalidEmailDomain,
  missingRequiredFieldsMessage
} = require('../app/helpers');
const {
  mockUser,
  passwordTooShortUser,
  wrongFormatPasswordUser,
  wrongDomainUser,
  passwordMissingUser,
  emailMissingUser,
  emptyUser,
  firstNameMissingUser,
  lastNameMissingUser
} = require('./mocks/mockUsers');
const request = supertest(app);

describe('POST /users', () => {
  it('should success when data passes validation checks', () =>
    request
      .post('/users')
      .send(mockUser)
      .then(res => {
        expect(res.statusCode).to.equal(201);
        return User.findOne({ where: { email: mockUser.email } });
      })
      .then(user => {
        const arePasswordsEqual = bcrypt.compare(mockUser.password, user.password);
        return Promise.all([user, arePasswordsEqual]);
      })
      .then(([user, arePasswordsEqual]) => {
        expect(arePasswordsEqual).to.equal(true);
        expect(user.firstName).to.equal(mockUser.firstName);
        expect(user.lastName).to.equal(mockUser.lastName);
        expect(user.email).to.equal(mockUser.email);
      }));

  it('should fail because email already exists', () =>
    request
      .post('/users')
      .send(mockUser)
      .then(() => request.post('/users').send(mockUser))
      .then(response => {
        expect(response.body.message).to.include(alreadyExistsErrorMessage);
        expect(response.statusCode).to.equal(422);
      }));

  it('should fail because password is badly formatted (too short)', () => {
    request
      .post('/users')
      .send(passwordTooShortUser)
      .then(response => {
        expect(response.body.message).to.include(invalidPasswordLengthMessage);
        expect(response.statusCode).to.equal(422);
      });
  });

  it('should fail because password is badly formatted (not containing letters and numbers)', () =>
    request
      .post('/users')
      .send(wrongFormatPasswordUser)
      .then(response => {
        expect(response.body.message).to.include(invalidPasswordMessage);
        expect(response.statusCode).to.equal(422);
      }));

  it('should fail because email is not @wolox.com.ar', () =>
    request
      .post('/users')
      .send(wrongDomainUser)
      .then(response => {
        expect(response.body.message).to.include(invalidEmailDomain);
        expect(response.statusCode).to.equal(422);
      }));

  it('should fail because firstName is missing', () =>
    request
      .post('/users')
      .send(firstNameMissingUser)
      .then(response => {
        expect(response.body.message).to.include(missingRequiredFieldsMessage);
        expect(response.body.message).to.include('firstName');
        expect(response.statusCode).to.equal(400);
      }));

  it('should fail because lastName is missing', () =>
    request
      .post('/users')
      .send(lastNameMissingUser)
      .then(response => {
        expect(response.body.message).to.include(missingRequiredFieldsMessage);
        expect(response.body.message).to.include('lastName');
        expect(response.statusCode).to.equal(400);
      }));

  it('should fail because email is missing', () =>
    request
      .post('/users')
      .send(emailMissingUser)
      .then(response => {
        expect(response.body.message).to.include(missingRequiredFieldsMessage);
        expect(response.body.message).to.include('email');
        expect(response.statusCode).to.equal(400);
      }));

  it('should fail because password is missing', () =>
    request
      .post('/users')
      .send(passwordMissingUser)
      .then(response => {
        expect(response.body.message).to.include(missingRequiredFieldsMessage);
        expect(response.body.message).to.include('password');
        expect(response.statusCode).to.equal(400);
      }));

  it('should  fail because of several missing fields', () =>
    request
      .post('/users')
      .send(emptyUser)
      .then(response => {
        const msg = response.body.message;
        expect(msg).to.include(missingRequiredFieldsMessage);
        expect(msg).to.include('firstName');
        expect(msg).to.include('lastName');
        expect(msg).to.include('email');
        expect(msg).to.include('password');
      }));
});
