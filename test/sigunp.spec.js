const supertest = require('supertest');
const { expect: expectChai } = require('chai');
const bcrypt = require('bcryptjs');
const app = require('../app');
const { User } = require('../app/models');
const {
  alreadyExistsErrorMessage,
  invalidPasswordLengthMessage,
  invalidPasswordMessage,
  invalidEmailDomainMessage,
  missingRequiredFieldsMessage,
  EMAIL_DOMAIN
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
const { ENTITY_ALREADY_EXISTS, MISSING_DATA_ERROR, VALIDATION_ERROR } = require('../app/errors');
const request = supertest(app);
const createUser = user => request.post('/users').send(user);

describe('POST /users', () => {
  it('should success when data passes validation checks', () =>
    createUser(mockUser)
      .then(res => {
        expectChai(res.statusCode).to.equal(201);
        return User.findOne({ where: { email: mockUser.email } });
      })
      .then(user => {
        const arePasswordsEqual = bcrypt.compare(mockUser.password, user.password);
        return Promise.all([user, arePasswordsEqual]);
      })
      .then(([user, arePasswordsEqual]) => {
        expectChai(arePasswordsEqual).to.equal(true);
        expectChai(user.firstName).to.equal(mockUser.firstName);
        expectChai(user.lastName).to.equal(mockUser.lastName);
        expectChai(user.email).to.equal(mockUser.email);
      }));

  it('should fail because email already exists', () =>
    createUser(mockUser)
      .then(() => request.post('/users').send(mockUser))
      .then(response => {
        expectChai(response.body.message).to.include(alreadyExistsErrorMessage);
        expectChai(response.body.internal_code).to.equal(ENTITY_ALREADY_EXISTS);
        expectChai(response.statusCode).to.equal(422);
      }));

  it('should fail because password is badly formatted (too short)', () =>
    createUser(passwordTooShortUser).then(response => {
      expectChai(response.body.message).to.include(invalidPasswordLengthMessage);
      expectChai(response.body.internal_code).to.equal(VALIDATION_ERROR);
      expectChai(response.statusCode).to.equal(422);
    }));

  it('should fail because password is badly formatted (not containing letters and numbers)', () =>
    createUser(wrongFormatPasswordUser).then(response => {
      expectChai(response.body.message).to.include(invalidPasswordMessage);
      expectChai(response.body.internal_code).to.equal(VALIDATION_ERROR);
      expectChai(response.statusCode).to.equal(422);
    }));

  it(`should fail because email is not ${EMAIL_DOMAIN}`, () =>
    createUser(wrongDomainUser).then(response => {
      expectChai(response.body.message).to.include(invalidEmailDomainMessage);
      expectChai(response.body.internal_code).to.equal(VALIDATION_ERROR);
      expectChai(response.statusCode).to.equal(422);
    }));

  it('should fail because firstName is missing', () =>
    createUser(firstNameMissingUser).then(response => {
      expectChai(response.body.message).to.include(missingRequiredFieldsMessage);
      expectChai(response.body.message).to.include('firstName');
      expectChai(response.body.internal_code).to.equal(MISSING_DATA_ERROR);
      expectChai(response.statusCode).to.equal(400);
    }));

  it('should fail because lastName is missing', () =>
    createUser(lastNameMissingUser).then(response => {
      expectChai(response.body.message).to.include(missingRequiredFieldsMessage);
      expectChai(response.body.message).to.include('lastName');
      expectChai(response.body.internal_code).to.equal(MISSING_DATA_ERROR);
      expectChai(response.statusCode).to.equal(400);
    }));

  it('should fail because email is missing', () =>
    createUser(emailMissingUser).then(response => {
      expectChai(response.body.message).to.include(missingRequiredFieldsMessage);
      expectChai(response.body.message).to.include('email');
      expectChai(response.body.internal_code).to.equal(MISSING_DATA_ERROR);
      expectChai(response.statusCode).to.equal(400);
    }));

  it('should fail because password is missing', () =>
    createUser(passwordMissingUser).then(response => {
      expectChai(response.body.message).to.include(missingRequiredFieldsMessage);
      expectChai(response.body.message).to.include('password');
      expectChai(response.body.internal_code).to.equal(MISSING_DATA_ERROR);
      expectChai(response.statusCode).to.equal(400);
    }));

  it('should  fail because of several missing fields', () =>
    createUser(emptyUser).then(response => {
      const msg = response.body.message;
      expectChai(msg).to.include(missingRequiredFieldsMessage);
      expectChai(msg).to.include('firstName');
      expectChai(msg).to.include('lastName');
      expectChai(msg).to.include('email');
      expectChai(msg).to.include('password');
      expectChai(response.body.internal_code).to.equal(MISSING_DATA_ERROR);
      expectChai(response.statusCode).to.equal(400);
    }));
});
