const { factory } = require('factory-girl');
const { hashPassword } = require('../../app/services/encryption');
const { User, UserAlbum, Session } = require('../../app/models');
const { EMAIL_DOMAIN, createToken, REGULAR_ROLE, ADMIN_ROLE } = require('../../app/helpers');
const { extractField } = require('../serializers/fieldExtractor');

factory.define('user', User, {
  firstName: factory.chance('first'),
  lastName: factory.chance('last'),
  email: factory.seq('User.email', n => `mail-${n}@${EMAIL_DOMAIN}`),
  password: () => hashPassword({ password: '1234567ocho' }).then(hashed => hashed.password)
});

factory.define('album', UserAlbum, {
  userId: 1,
  albumId: factory.seq('UserAlbum.albumId')
});

factory.define('session', Session, {
  userId: 1,
  token: createToken({ userId: 1 })
});

exports.runFactory = factoryName => count =>
  factory.createMany(factoryName, count).then(extractField('dataValues'));

exports.authorizationFactory = {
  regular: userId => {
    const token = createToken({ userId, role: REGULAR_ROLE });
    return Session.createSession({ userId, token }).then(() => ({ authorization: token }));
  },
  admin: userId => {
    const token = createToken({ userId, role: ADMIN_ROLE });
    return Session.createSession({ userId, token }).then(() => ({ authorization: token }));
  },
  invalid: { authorization: 'invalid' }
};
