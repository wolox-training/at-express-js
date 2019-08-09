const axios = require('axios');
const { externalEndpoints } = require('../../config/externalEndpoints');
const { errorMessages } = require('../helpers');

const formatData = a => a.data;

const externalApiError = e => {
  const status = e.response.status || 500;
  const message = errorMessages[status.toString()] || errorMessages.general;
  return {
    status,
    message
  };
};

const processExternalRequest = request => request.then(formatData).catch(externalApiError);

exports.getAllAlbums = () => processExternalRequest(axios.get(externalEndpoints.albums));

exports.getAlbumById = albumId => processExternalRequest(axios.get(`${externalEndpoints.albums}/${albumId}`));

exports.getPhotosByAlbum = albumId =>
  processExternalRequest(axios.get(`${externalEndpoints.photos}/?albumId=${albumId}`));
