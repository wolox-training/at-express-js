const { User } = require('../models');

exports.getAllUsers = () => User.getAll();

exports.getUserByEmail = email => User.findByEmail(email);
