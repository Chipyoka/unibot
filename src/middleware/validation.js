const Joi = require('joi');
const { badRequest } = require('../utils/responseHelper');

const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) return badRequest(res, error.details.map(d => d.message).join(', '));
  req.body = value;
  next();
};

module.exports = { validate };
