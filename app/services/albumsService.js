const { Album } = require('../models');

exports.createAlbum = userId => album => Album.createAlbum(album.id, userId);

exports.getUserAlbums = userId => Album.findBy({ userId });
