const supertest = require('supertest');
const { expect } = require('chai');
const app = require('../app');
const request = supertest(app);
const { createUsers } = require('./helpers');
const { host, port } = require('../config').common.api;

describe('GET /users', () => {
  it('should succes when user is logged in', () =>
    createUsers(25)
      .then(() => request.get('/users'))
      .then(response => {
        const { count, result, prev, next } = response.body;

        expect(count).to.equal(25);
        expect(result.length).to.equal(10);
        expect(prev).to.equal(null);
        expect(next).to.equal(`${host}:${port}/users?page=2`);
      }));
});
