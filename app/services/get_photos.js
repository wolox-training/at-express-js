const axios = require('axios');

const endpoint = 'https://jsonplaceholder.typicode.com/photos';

exports.getPhotos = albumId => axios.get(`${endpoint}/?albumId=${albumId}`);
