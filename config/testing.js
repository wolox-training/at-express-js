exports.config = {
  environment: 'testing',
  isTesting: true,
  common: {
    database: {
      name: process.env.DB_NAME_TEST
    },
    token: {
      secret: 'some-super-secret'
    },
    session: {
      secret: 'some-super-secret'
    }
  }
};
