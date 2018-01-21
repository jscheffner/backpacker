const { Joi } = require('celebrate');

const id = Joi.string().length(24).required();

const params = Joi.object().keys({
  id,
});

const search = {
  query: Joi.object().keys({
    email: Joi.string().email().optional(),
  }),
};

const create = {
  body: Joi.object().keys({
    googleId: Joi.string(),
    deviceToken: Joi.string().optional(),
    firstName: Joi.string().min(1).required(),
    lastName: Joi.string().min(1).required(),
    email: Joi.string().email(),
  }),
};

const update = {
  body: Joi.object().keys({
    firstName: Joi.string().min(1).optional(),
    lastName: Joi.string().min(1).optional(),
    email: Joi.string().email().optional(),
    deviceToken: Joi.string().optional(),
  }),
  params,
};

const idParam = {
  params,
};

const friendIdBody = {
  body: Joi.object().keys({
    friend: id,
  }),
};

const friendIdParam = {
  params: Joi.object().keys({
    friendId: id,
    id,
  }),
};

const notify = {
  query: Joi.object().keys({
    notify: Joi.boolean().optional(),
  }),
};

module.exports = {
  create,
  update,
  idParam,
  friendIdBody,
  friendIdParam,
  search,
  notify,
};
