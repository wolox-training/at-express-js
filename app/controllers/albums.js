const { getAlbums, getAlbum } = require('../services/get_albums');
const { getPhotos } = require('../services/get_photos');

exports.albums = (req, res, next) => {
  const albumId = req.params.id;
  const respond = albumId ? getAlbum : getAlbums;
  return respond(albumId)
    .then(response => res.json(response.data))
    .catch(next);
};

exports.photos = (req, res, next) => {
  const albumId = req.params.id;
  return getPhotos(albumId)
    .then(response => res.json(response.data))
    .catch(next);
};
