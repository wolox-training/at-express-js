const bcrypt = require('bcryptjs');
const { encryptionError } = require('../errors');
const saltRounds = 10;
exports.hashPassword = obj =>
  bcrypt
    .hash(obj.password, saltRounds)
    .then(password => ({ ...obj, password }))
    .catch(error => {
      throw encryptionError(error.message);
    });

// eslint-disable-next-line max-len
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gim;

exports.validations = toValidate => ({
  isEmailValid: () => toValidate.email.match(emailRegex),
  checkEmailDomain: domain => toValidate.email.split('@')[1] === domain,
  checkMissingFields: fields => {
    const missingFields = fields.reduce((result, fieldName) => {
      if (!toValidate[fieldName]) {
        return result.concat(fieldName);
      }
      return result;
    }, []);

    return missingFields.length !== 0 && missingFields;
  },
  isFormatValid: (field, formats) =>
    formats.reduce((result, format) => {
      if (!toValidate[field].match(format)) {
        return false;
      }
      return result;
    }, true),
  checkMinLength: length => toValidate.password.length >= length
});
