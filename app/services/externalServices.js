const axios = require('axios');
const { externalEndpoints } = require('../../config/externalEndpoints');
const { externalApiError } = require('../errors');

const formatData = a => a.data;

const processExternalRequest = request =>
  request.then(formatData).catch(responseError => {
    throw externalApiError(responseError.message);
  });

exports.getAllAlbums = () => processExternalRequest(axios.get(externalEndpoints.albums));

exports.getAlbumById = albumId => processExternalRequest(axios.get(`${externalEndpoints.albums}/${albumId}`));

exports.getPhotosByAlbum = albumId =>
  processExternalRequest(axios.get(`${externalEndpoints.photos}/?albumId=${albumId}`));
