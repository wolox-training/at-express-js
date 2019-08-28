exports.config = {
  environment: 'testing',
  isTesting: true,
  common: {
    database: {
      name: process.env.DB_NAME_TEST
    },
    api: {
      host: `${process.env.HOST}:${process.env.PORT}`
    },
    externalApi: {
      albumsEndpoint: 'https://jsonplaceholder.typicode.com/albums'
    },
    token: {
      secret: 'some-super-secret'
    },
    session: {
      secret: 'some-super-secret'
    }
  }
};
