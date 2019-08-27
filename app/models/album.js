'use strict';
const { handleError, prepareResponse } = require('../helpers/modelHelpers');

module.exports = (sequelize, DataTypes) => {
  const Album = sequelize.define(
    'Album',
    {
      albumId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'album_id'
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id'
      }
    },
    { underscored: true }
  );

  Album.createAlbum = (albumId, userId) =>
    Album.create({ albumId, userId })
      .then(prepareResponse)
      .catch(handleError('Unable to create new album'));

  Album.removeAttribute('id');
  return Album;
};
