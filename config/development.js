exports.config = {
  environment: 'development',
  common: {
    api: {
      host: process.env.DEV_HOST
    },
    database: {
      name: process.env.DB_NAME_DEV
    }
  },
  isDevelopment: true
};
