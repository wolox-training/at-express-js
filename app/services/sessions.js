const { Session } = require('../models');
const { handleError } = require('../services/commons/errorHandler');

exports.createSession = (token, userId) =>
  Session.createSession(token, userId).catch(handleError('Unable to create session'));

exports.invalidateAllSessions = userId =>
  Session.remove(userId).catch(handleError('Unable to invalidate sessions'));
