const { checkSchema } = require('express-validator');
const { getValidationErrors } = require('./middlewares/getValidationErrors');
const { validatePermissions, validateAlbumPermissions } = require('./middlewares/validatePermissions');
const { healthCheck } = require('./controllers/healthCheck');
const { getAlbums, getPhotos, buyAlbum } = require('./controllers/albums');
const { signUp, signIn, getUsers, createAdmin } = require('./controllers/users');
const { userSchema } = require('./schemas/userSchema');
const { signedUpUserSchema } = require('./schemas/signedUpUserSchema');
const { validateToken } = require('./middlewares/validateToken');

exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/albums', getAlbums);
  app.get('/albums/:id', getAlbums);
  app.get('/albums/:id/photos', getPhotos);
  app.post('/albums/:id', validateToken, buyAlbum);

  app.get('/users', validateToken, getUsers);
  app.get('/users/:id', validateToken, getUsers);
  app.get('/users/:userId/albums', [validateToken, validateAlbumPermissions], getAlbums);
  app.post('/users', [checkSchema(userSchema), getValidationErrors], signUp);
  app.post('/users/sessions', [checkSchema(signedUpUserSchema), getValidationErrors], signIn);
  app.post(
    '/admin/users',
    [checkSchema(userSchema), getValidationErrors, validateToken, validatePermissions(['admin'])],
    createAdmin
  );
};
