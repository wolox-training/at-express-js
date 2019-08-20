const chance = require('chance')();
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

const request = supertest(app);
const mockUser = {
  firstName: chance.first(),
  lastName: chance.last(),
  email: chance.email({ domain: 'wolox.com.ar' }),
  password: chance.word({ length: 8 }) + chance.integer({ min: 0, max: 9 })
};

describe('POST /users', () => {
  it('should create a new user and respond with code 201 when data passes validation checks', () =>
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

  it('should respond with 422 when email already exists', () =>
    request
      .post('/users')
      .send(mockUser)
      .then(() => request.post('/users').send(mockUser))
      .then(response => {
        expect(response.body.message).to.include(alreadyExistsErrorMessage);
        expect(response.statusCode).to.equal(422);
      }));

  it('should respond with 422 when password is badly formatted (too short)', () => {
    const errorUser = {
      ...mockUser,
      password: chance.word({ length: 2 }) + chance.integer({ min: 0, max: 9 })
    };
    request
      .post('/users')
      .send(errorUser)
      .then(response => {
        expect(response.body.message).to.include(invalidPasswordLengthMessage);
        expect(response.statusCode).to.equal(422);
      });
  });

  it('should respond with 422 when password is badly formatted (not containing letters and numbers)', () => {
    const password = chance.word({ length: 10 });
    const errorUser = {
      ...mockUser,
      password
    };
    return request
      .post('/users')
      .send(errorUser)
      .then(response => {
        expect(response.body.message).to.include(invalidPasswordMessage);
        expect(response.statusCode).to.equal(422);
      });
  });

  it('should respond with 422 when email is not @wolox.com.ar', () => {
    const errorUser = {
      ...mockUser,
      email: chance.email({ domain: 'different.com.ar' })
    };
    return request
      .post('/users')
      .send(errorUser)
      .then(response => {
        expect(response.body.message).to.include(invalidEmailDomain);
        expect(response.statusCode).to.equal(422);
      });
  });

  it('should respond with 400 when firstName is missing', () => {
    const errorUser = {
      ...mockUser,
      firstName: null
    };
    return request
      .post('/users')
      .send(errorUser)
      .then(response => {
        expect(response.body.message).to.include(missingRequiredFieldsMessage);
        expect(response.body.message).to.include('firstName');
        expect(response.statusCode).to.equal(400);
      });
  });

  it('should respond with 400 when lastName is missing', () => {
    const errorUser = {
      ...mockUser,
      lastName: null
    };
    return request
      .post('/users')
      .send(errorUser)
      .then(response => {
        expect(response.body.message).to.include(missingRequiredFieldsMessage);
        expect(response.body.message).to.include('lastName');
        expect(response.statusCode).to.equal(400);
      });
  });

  it('should respond with 400 when email is missing', () => {
    const errorUser = {
      ...mockUser,
      email: null
    };
    return request
      .post('/users')
      .send(errorUser)
      .then(response => {
        expect(response.body.message).to.include(missingRequiredFieldsMessage);
        expect(response.body.message).to.include('email');
        expect(response.statusCode).to.equal(400);
      });
  });

  it('should respond with 400 when password is missing', () => {
    const errorUser = {
      ...mockUser,
      password: null
    };
    return request
      .post('/users')
      .send(errorUser)
      .then(response => {
        expect(response.body.message).to.include(missingRequiredFieldsMessage);
        expect(response.body.message).to.include('password');
        expect(response.statusCode).to.equal(400);
      });
  });

  it('should list all missing fields', () => {
    const errorUser = {};
    return request
      .post('/users')
      .send(errorUser)
      .then(response => {
        const msg = response.body.message;
        expect(msg).to.include(missingRequiredFieldsMessage);
        expect(msg).to.include('firstName');
        expect(msg).to.include('lastName');
        expect(msg).to.include('email');
        expect(msg).to.include('password');
      });
  });
});
