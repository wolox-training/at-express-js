const axios = require('axios');
const { albumsEndpoint, photosEndpoint } = require('../../config').common.externalApi;
const { externalApiError } = require('../errors');

const formatData = a => a.data;

const processExternalRequest = request =>
  request.then(formatData).catch(responseError => {
    throw externalApiError(responseError.message);
  });

exports.getAllAlbums = () => processExternalRequest(axios.get(albumsEndpoint));

exports.getAlbumById = albumId => processExternalRequest(axios.get(`${albumsEndpoint}/${albumId}`));

exports.getPhotosByAlbum = albumId =>
  processExternalRequest(axios.get(`${photosEndpoint}/?albumId=${albumId}`));
