const { factory } = require('factory-girl');
const { User, Album } = require('../../app/models');
const { EMAIL_DOMAIN, hashPassword, createToken, REGULAR_ROLE, ADMIN_ROLE } = require('../../app/helpers');
const { extractField } = require('../serializers/fieldExtractor');

factory.define('user', User, {
  firstName: factory.chance('first'),
  lastName: factory.chance('last'),
  email: factory.seq('User.email', n => `mail-${n}@${EMAIL_DOMAIN}`),
  password: () => hashPassword({ password: '1234567ocho' }).then(hashed => hashed.password)
});

exports.runFactory = factoryName => count =>
  factory.createMany(factoryName, count).then(extractField('dataValues'));

factory.define('album', Album, {
  userId: 1,
  albumId: factory.seq('Album.albumId')
});

exports.authorizationFactory = {
  regular: id => ({ authorization: createToken({ userId: id, role: REGULAR_ROLE }) }),
  admin: id => ({ authorization: createToken({ userId: id, role: ADMIN_ROLE }) }),
  invalid: { authorization: 'invalid' }
};
