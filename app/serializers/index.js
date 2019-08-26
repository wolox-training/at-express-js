const { port, host } = require('../../config').common.api;
const { userSchema } = require('../schemas/userSchema');

exports.extractFields = (schema, skip) => rawData => {
  const fields = skip ? Object.keys(schema).filter(field => field !== skip) : Object.keys(schema);
  const transform = e => fields.reduce((user, field) => ({ ...user, [field]: e[field] }), {});

  if (Array.isArray(rawData)) {
    return rawData.map(transform);
  }

  return transform(rawData);
};

exports.extractField = field => rawData => {
  if (Array.isArray(rawData)) {
    return rawData.map(e => e[field]);
  }
  return rawData && rawData[field];
};

exports.paginatedResponse = ({ resource, offset, limit, page }) => response => {
  const nextExists = offset + limit < response.count;
  const getUserFields = exports.extractFields(userSchema, 'password');

  return {
    count: response.count,
    result: getUserFields(response.rows),
    prev: page > 1 ? `${host}:${port}/${resource}?page=${page - 1}` : null,
    next: nextExists ? `${host}:${port}/${resource}?page=${page + 1}` : null
  };
};
