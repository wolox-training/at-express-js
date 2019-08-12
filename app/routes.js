const { healthCheck } = require('./controllers/healthCheck');
const { getAlbums, getPhotos } = require('./controllers/albums');
const { userValidation } = require('./middlewares/userValidations');
const { signUp } = require('./controllers/users');

exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/albums', getAlbums);
  app.get('/albums/:id', getAlbums);
  app.get('/albums/:id/photos', getPhotos);

  app.post('/users', userValidation, signUp);
};
