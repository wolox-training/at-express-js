const { checkSchema } = require('express-validator');
const { getValidationErrors } = require('./middlewares/getValidationErrors');
const { validatePassword } = require('./middlewares/validatePassword');
const { healthCheck } = require('./controllers/healthCheck');
const { getAlbums, getPhotos } = require('./controllers/albums');
const { signUp, signIn, getUsers } = require('./controllers/users');
const { userSchema } = require('./schemas/userSchema');
const { signedUpUserSchema } = require('./schemas/signedUpUserSchema');
const { validateToken } = require('./middlewares/validateToken');

exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/albums', getAlbums);
  app.get('/albums/:id', getAlbums);
  app.get('/albums/:id/photos', getPhotos);

  app.get('/users', validateToken, getUsers);
  app.get('/users/:email', validateToken, getUsers);
  app.post('/users', [checkSchema(userSchema), getValidationErrors], signUp);
  app.post(
    '/users/sessions',
    [checkSchema(signedUpUserSchema), getValidationErrors, validatePassword],
    signIn
  );
};
