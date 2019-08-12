const { getAllAlbums, getAlbumById, getPhotosByAlbum } = require('../services/externalServices');

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
