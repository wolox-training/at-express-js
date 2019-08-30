const { checkSchema } = require('express-validator');
const { getValidationErrors } = require('./middlewares/getValidationErrors');
const { validatePermissions, validateAlbumPermissions } = require('./middlewares/validatePermissions');
const { healthCheck } = require('./controllers/healthCheck');
const { getAlbums, getPhotos, buyAlbum, getUserAlbumPhotos } = require('./controllers/albums');
const { signUp, getUsers, createAdmin } = require('./controllers/users');
const { signIn, invalidateSessions } = require('./controllers/sessions');
const { userSchema } = require('./schemas/userSchema');
const { signedUpUserSchema } = require('./schemas/signedUpUserSchema');
const { validateToken } = require('./middlewares/validateToken');
const { ADMIN_ROLE } = require('./helpers');

exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/albums', getAlbums);
  app.get('/albums/:id', getAlbums);
  app.get('/albums/:id/photos', getPhotos);
  app.post('/albums/:id', validateToken, buyAlbum);

  app.get('/users', validateToken, getUsers);
  app.get('/users/:id', validateToken, getUsers);
  app.get('/users/:userId/albums', [validateToken, validateAlbumPermissions], getAlbums);
  app.get('/users/albums/:albumId/photos', [validateToken], getUserAlbumPhotos);
  app.post('/users', [checkSchema(userSchema), getValidationErrors], signUp);
  app.post('/users/sessions', [checkSchema(signedUpUserSchema), getValidationErrors], signIn);
  app.post('/users/sessions/invalidate_all', [validateToken], invalidateSessions);
  app.post(
    '/admin/users',
    [checkSchema(userSchema), getValidationErrors, validateToken, validatePermissions([ADMIN_ROLE])],
    createAdmin
  );
};
