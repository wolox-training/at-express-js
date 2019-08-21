const {
  EMAIL_DOMAIN,
  PASSWORD_FORMATS,
  MIN_LENGTH,
  invalidEmailDomainMessage,
  invalidPasswordMessage,
  invalidPasswordLengthMessage
} = require('../helpers');

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
      errorMessage: invalidEmailDomainMessage
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
    },
    isLength: {
      options: {
        min: MIN_LENGTH
      },
      errorMessage: invalidPasswordLengthMessage
    }
  }
};
