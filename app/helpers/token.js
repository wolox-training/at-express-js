const jwt = require('jwt-simple');
const config = require('../../config');
const { secret } = config.common.token;

exports.createToken = payload => jwt.encode(payload, secret);
exports.decodeToken = token =>
  new Promise((resolve, reject) => {
    try {
      resolve(jwt.decode(token, secret));
    } catch (e) {
      reject(e);
    }
  });
