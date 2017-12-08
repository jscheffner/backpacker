const { Joi } = require('celebrate');

const id = Joi.string().length(24).required();

const params = Joi.object().keys({
  id,
});

const create = {
  body: Joi.object().keys({
    firstName: Joi.string().min(1).required(),
    lastName: Joi.string().min(1).required(),
    birthday: Joi.date().required(),
  }),
};

const update = {
  body: Joi.object().keys({
    firstName: Joi.string().min(1).optional(),
    lastName: Joi.string().min(1).optional(),
    birthday: Joi.date().optional(),
  }),
  params,
};

const idParam = {
  params,
};

const addFriend = {
  body: Joi.object().keys({
    friend: id,
  }),
  params,
};

const deleteFriend = {
  params: Joi.object().keys({
    friendId: id,
    id,
  }),
};

module.exports = {
  create,
  update,
  idParam,
  addFriend,
  deleteFriend,
};
