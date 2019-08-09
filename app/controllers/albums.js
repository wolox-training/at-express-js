const { getAllAlbums, getAlbumById, getPhotosByAlbum } = require('../services/externalServices');

const sendResponse = res => response => {
  res.status(response.status || 200);
  res.json(response);
};

exports.getAlbums = (req, res, next) => {
  const albumId = req.params.id;
  const selectGetFn = albumId ? getAlbumById : getAllAlbums;
  return selectGetFn(albumId)
    .then(sendResponse(res))
    .catch(next);
};

exports.getPhotos = (req, res, next) => {
  const albumId = req.params.id;
  return getPhotosByAlbum(albumId)
    .then(sendResponse(res))
    .catch(next);
};
