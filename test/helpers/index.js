const { factory } = require('factory-girl');
const { User } = require('../../app/models');
const { hashPassword } = require('../../app/helpers');
const { EMAIL_DOMAIN } = require('../../app/helpers');
const { extractField } = require('../../app/serializers');

factory.define('user', User, {
  firstName: factory.chance('first'),
  lastName: factory.chance('last'),
  email: factory.seq('User.email', n => `mail-${n}@${EMAIL_DOMAIN}`),
  password: () => hashPassword({ password: '1234567ocho' }).then(hashed => hashed.password)
});

exports.createUsers = count => factory.createMany('user', count).then(extractField('dataValues'));
