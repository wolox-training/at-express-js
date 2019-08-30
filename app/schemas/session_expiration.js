exports.sessionExpirationSchema = {
  duration: {
    in: ['query'],
    isEmpty: {
      errorMessage: 'You must set a duration',
      negated: true
    }
  }
};
