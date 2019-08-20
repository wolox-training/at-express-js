const { EMAIL_DOMAIN, PASSWORD_FORMATS, MIN_LENGTH } = require('../helpers/constants');
exports.userSchema = {
  firstName: {
    in: ['body'],
    isEmpty: {
      errorMessage: 'missing_field',
      negated: true
    }
  },
  lastName: {
    in: ['body'],
    isEmpty: {
      errorMessage: 'missing_field',
      negated: true
    }
  },
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
      errorMessage: `The email must be @${EMAIL_DOMAIN}`
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
      errorMessage: 'Password format invalid'
    },
    isLength: {
      options: {
        min: MIN_LENGTH
      },
      errorMessage: `Password must be at least ${MIN_LENGTH} characters`
    }
  }
};
