const supertest = require('supertest');
const app = require('../app');
const request = supertest(app);
const { mockUser } = require('./mocks/mockUsers');
const emails = require('../app/services/emails');
jest.mock('../app/services/emails');

describe('Email sending', () => {
  test('Welcome email on signup', () => {
    emails.sendWelcomeEmail.mockResolvedValue('SEND EMAIL');

    return request
      .post('/users')
      .send(mockUser)
      .then(() => {
        expect(emails.sendWelcomeEmail.mock.calls.length).toBe(1);
      });
  });
});
