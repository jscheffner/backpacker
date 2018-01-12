const { Joi } = require('celebrate');

const id = Joi.string().length(24).required();

const params = Joi.object().keys({
  id,
});

const create = {
  body: Joi.object().keys({
    firstName: Joi.string().min(1).required(),
    lastName: Joi.string().min(1).required(),
  }),
};

const update = {
  body: Joi.object().keys({
    firstName: Joi.string().min(1).optional(),
    lastName: Joi.string().min(1).optional(),
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

module.exports = {
  create,
  update,
  idParam,
  friendIdBody,
  friendIdParam,
};
