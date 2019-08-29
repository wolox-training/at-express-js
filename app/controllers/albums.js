const { getAllAlbums, getAlbumById, getPhotosByAlbum } = require('../services/externalServices');
const { createUserAlbum } = require('../services/albums');

exports.getAlbums = (req, res, next) => {
  const albumId = req.params.id;
  const selectGetFn = albumId ? getAlbumById : getAllAlbums;
  return selectGetFn(albumId)
    .then(response => res.send(response))
    .catch(next);
};

exports.getPhotos = (req, res, next) => {
  const albumId = req.params.id;
  return getPhotosByAlbum(albumId)
    .then(response => res.send(response))
    .catch(next);
};

exports.buyAlbum = (req, res, next) => {
  const { userId } = req.locals;
  const { id } = req.params;
  return getAlbumById(parseInt(id))
    .then(createUserAlbum(userId))
    .then(() => res.status(201).end())
    .catch(next);
};
