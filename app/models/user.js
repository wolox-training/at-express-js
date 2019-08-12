module.exports = (sequelizeInstance, dataTypes) =>
  sequelizeInstance.define('user', {
    id: {
      type: dataTypes.INTEGER,
      allowNull: false,
      unique: true,
      autoIncrement: true,
      primaryKey: true
    },
    firstname: {
      type: dataTypes.STRING,
      allowNull: false
    },
    lastname: {
      type: dataTypes.STRING,
      allowNull: false
    },
    email: {
      type: dataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: dataTypes.STRING,
      allowNull: false
    }
  });
