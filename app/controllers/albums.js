const { getAllAlbums, getAlbumById, getPhotosByAlbum } = require('../services/externalServices');
const { createAlbum } = require('../services/albumsService');

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
  const { email } = req.locals;
  const { id } = req.params;
  return getAlbumById(id)
    .then(album => createAlbum(album, email))
    .then(response => {
      res.send(response);
    })
    .catch(next);
};
