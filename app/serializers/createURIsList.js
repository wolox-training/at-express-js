const { host, port } = require('../../config').common.api;
exports.createURIsList = (list, resource, id, fields) =>
  list.map(item => {
    const listItem = fields ? fields.reduce((obj, field) => ({ ...obj, field: item[field] }), {}) : item;
    return { ...listItem, uri: `${host}:${port}/${resource}/${item[id]}` };
  });
