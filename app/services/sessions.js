const { Session } = require('../models');
const { handleError } = require('../services/commons/errorHandler');

exports.createSession = (token, userId) =>
  Session.create({ token, userId }).catch(handleError('Unable to create session'));

exports.invalidateAllSessions = userId =>
  Session.remove({ userId }).catch(handleError('Unable to invalidate sessions'));
