const { host } = require('../../config').common.api;

exports.paginatedResponse = ({ resource, offset, limit, page, getFieldsFn }) => response => {
  const nextExists = offset + limit < response.count;
  return {
    count: response.count,
    result: getFieldsFn(response.rows),
    prev: page > 1 ? `${host}/${resource}?page=${page - 1}` : null,
    next: nextExists ? `${host}/${resource}?page=${page + 1}` : null
  };
};
