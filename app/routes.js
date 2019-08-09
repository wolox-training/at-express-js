// const controller = require('./controllers/controller');
const { healthCheck } = require('./controllers/healthCheck');
const { albums, photos } = require('./controllers/albums');

exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/albums', albums);
  app.get('/albums/:id', albums);
  app.get('/albums/:id/photos', photos);
  // app.get('/endpoint/get/path', [], controller.methodGET);
  // app.put('/endpoint/put/path', [], controller.methodPUT);
  // app.post('/endpoint/post/path', [], controller.methodPOST);
};
