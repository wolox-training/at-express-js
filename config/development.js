exports.config = {
  environment: 'development',
  common: {
    api: {
      host: 'http://localhost:8081'
    },
    database: {
      name: process.env.DB_NAME_DEV
    }
  },
  isDevelopment: true
};
