const { Session, SessionsConfig } = require('../models');
const { handleError } = require('../services/commons/errorHandler');

exports.createSession = (token, userId) =>
  Session.createSession(token, userId).catch(handleError('Unable to create session'));

exports.invalidateAllSessions = userId =>
  Session.remove({ userId }).catch(handleError('Unable to invalidate sessions'));

exports.sessionsExpiration = duration =>
  SessionsConfig.update(duration, 'token').catch(handleError('Unable to configure sessions expiration'));
