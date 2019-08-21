const { EMAIL_DOMAIN, PASSWORD_FORMATS, invalidEmailDomain, invalidPasswordMessage } = require('../helpers');

exports.signedUpUserSchema = {
  email: {
    in: ['body'],
    isEmpty: {
      errorMessage: 'missing_field',
      negated: true
    },
    isEmail: {
      errorMessage: 'Invalid email'
    },
    matches: {
      options: [EMAIL_DOMAIN],
      errorMessage: invalidEmailDomain
    }
  },
  password: {
    in: ['body'],
    isEmpty: {
      errorMessage: 'missing_field',
      negated: true
    },
    custom: {
      options: value =>
        PASSWORD_FORMATS.reduce((result, format) => {
          if (!value.match(format)) {
            return false;
          }
          return result;
        }, true),
      errorMessage: invalidPasswordMessage
    }
  }
};
