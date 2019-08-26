const { checkSchema } = require('express-validator');
const { getValidationErrors } = require('./middlewares/getValidationErrors');
const { healthCheck } = require('./controllers/healthCheck');
const { getAlbums, getPhotos } = require('./controllers/albums');
const { signUp, signIn } = require('./controllers/users');
const { userSchema } = require('./schemas/userSchema');
const { signedUpUserSchema } = require('./schemas/signedUpUserSchema');

exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/albums', getAlbums);
  app.get('/albums/:id', getAlbums);
  app.get('/albums/:id/photos', getPhotos);

  app.post('/users', [checkSchema(userSchema), getValidationErrors], signUp);
  app.post('/users/sessions', [checkSchema(signedUpUserSchema), getValidationErrors], signIn);
};
