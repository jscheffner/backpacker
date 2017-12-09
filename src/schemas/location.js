const { Joi } = require('celebrate');

const id = Joi.string().length(24).required();

const find = {
  query: {
    users: Joi.array().items(id).single().required(),
    googleId: Joi.string().optional(),
  },
};

const create = {
  body: Joi.object().keys({
    user: id,
    description: Joi.string().optional(),
    favorite: Joi.boolean().optional(),
    googleId: Joi.string().required(),
    coordinates: Joi.array().items(Joi.number()).length(2).required(),
    city: Joi.string().required(),
    country: Joi.string().required(),
  }),
};

const update = {
  params: Joi.object().keys({
    id,
  }),
  body: Joi.object().keys({
    description: Joi.string().optional(),
    favorite: Joi.boolean().optional(),
    googleId: Joi.string().required(),
    coordinates: Joi.array().items(Joi.number()).length(2).optional(),
  }),
};

const remove = {
  params: Joi.object().keys({
    id,
  }),
};

module.exports = {
  find,
  create,
  update,
  remove,
};
