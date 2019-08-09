const axios = require('axios');

const endpoint = 'https://jsonplaceholder.typicode.com/albums';

exports.getAlbums = () => axios.get(endpoint);

exports.getAlbum = albumId => axios.get(`${endpoint}/${albumId}`);
