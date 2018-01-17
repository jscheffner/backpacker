const { Joi } = require('celebrate');

const locationId = Joi.string().length(24).required();

const find = {
  query: {
    users: Joi.array().items(locationId).single().required(),
    googleId: Joi.string().optional(),
  },
};

const create = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    user: locationId,
    description: Joi.string().optional(),
    favorite: Joi.boolean().optional(),
    googleId: Joi.string().required(),
    coordinates: Joi.array().items(Joi.number()).length(2).required(),
    city: Joi.string().required(),
    country: Joi.string().required(),
    categories: Joi.array().items(Joi.string()).optional(),
  }),
};

const update = {
  params: Joi.object().keys({
    locationId,
  }),
  body: Joi.object().keys({
    description: Joi.string().optional(),
    favorite: Joi.boolean().optional(),
    googleId: Joi.string().required(),
    coordinates: Joi.array().items(Joi.number()).length(2).optional(),
    categories: Joi.array().items(Joi.string()).optional(),
  }),
};

const remove = {
  params: Joi.object().keys({
    locationId,
  }),
};

const idParam = {
  params: Joi.object().keys({
    locationId,
  }),
};

module.exports = {
  find,
  create,
  update,
  remove,
  idParam,
};
