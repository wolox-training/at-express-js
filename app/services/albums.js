const { UserAlbum } = require('../models');
const { handleError } = require('../services/commons/errorHandler');

exports.createUserAlbum = userId => album =>
  UserAlbum.createAlbum(album.id, userId).catch(handleError('Unable to create new album'));
