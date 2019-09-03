const supertest = require('supertest');
const { expect } = require('chai');
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
    createUser(mockUser)
      .then(() => request.post('/users').send(mockUser))
      .then(response => {
        expect(response.body.message).to.include(alreadyExistsErrorMessage);
        expect(response.body.internal_code).to.equal(ENTITY_ALREADY_EXISTS);
        expect(response.statusCode).to.equal(422);
      }));

  it('should fail because password is badly formatted (too short)', () =>
    createUser(passwordTooShortUser).then(response => {
      expect(response.body.message).to.include(invalidPasswordLengthMessage);
      expect(response.body.internal_code).to.equal(VALIDATION_ERROR);
      expect(response.statusCode).to.equal(422);
    }));

  it('should fail because password is badly formatted (not containing letters and numbers)', () =>
    createUser(wrongFormatPasswordUser).then(response => {
      expect(response.body.message).to.include(invalidPasswordMessage);
      expect(response.body.internal_code).to.equal(VALIDATION_ERROR);
      expect(response.statusCode).to.equal(422);
    }));

  it(`should fail because email is not ${EMAIL_DOMAIN}`, () =>
    createUser(wrongDomainUser).then(response => {
      expect(response.body.message).to.include(invalidEmailDomainMessage);
      expect(response.body.internal_code).to.equal(VALIDATION_ERROR);
      expect(response.statusCode).to.equal(422);
    }));

  it('should fail because firstName is missing', () =>
    createUser(firstNameMissingUser).then(response => {
      expect(response.body.message).to.include(missingRequiredFieldsMessage);
      expect(response.body.message).to.include('firstName');
      expect(response.body.internal_code).to.equal(MISSING_DATA_ERROR);
      expect(response.statusCode).to.equal(400);
    }));

  it('should fail because lastName is missing', () =>
    createUser(lastNameMissingUser).then(response => {
      expect(response.body.message).to.include(missingRequiredFieldsMessage);
      expect(response.body.message).to.include('lastName');
      expect(response.body.internal_code).to.equal(MISSING_DATA_ERROR);
      expect(response.statusCode).to.equal(400);
    }));

  it('should fail because email is missing', () =>
    createUser(emailMissingUser).then(response => {
      expect(response.body.message).to.include(missingRequiredFieldsMessage);
      expect(response.body.message).to.include('email');
      expect(response.body.internal_code).to.equal(MISSING_DATA_ERROR);
      expect(response.statusCode).to.equal(400);
    }));

  it('should fail because password is missing', () =>
    createUser(passwordMissingUser).then(response => {
      expect(response.body.message).to.include(missingRequiredFieldsMessage);
      expect(response.body.message).to.include('password');
      expect(response.body.internal_code).to.equal(MISSING_DATA_ERROR);
      expect(response.statusCode).to.equal(400);
    }));

  it('should  fail because of several missing fields', () =>
    createUser(emptyUser).then(response => {
      const msg = response.body.message;
      expect(msg).to.include(missingRequiredFieldsMessage);
      expect(msg).to.include('firstName');
      expect(msg).to.include('lastName');
      expect(msg).to.include('email');
      expect(msg).to.include('password');
      expect(response.body.internal_code).to.equal(MISSING_DATA_ERROR);
      expect(response.statusCode).to.equal(400);
    }));
});
