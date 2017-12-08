const { Joi } = require('celebrate');

const params = Joi.object().keys({
  id: Joi.string().length(24).required(),
});

const createUserSchema = {
  body: Joi.object().keys({
    firstName: Joi.string().min(1).required(),
    lastName: Joi.string().min(1).required(),
    birthday: Joi.date().required(),
  }),
};

const updateUserSchema = {
  body: Joi.object().keys({
    firstName: Joi.string().min(1).optional(),
    lastName: Joi.string().min(1).optional(),
    birthday: Joi.date().optional(),
  }),
  params,
};

const getOrDeleteUserSchema = {
  params,
};

module.exports = {
  createUserSchema,
  updateUserSchema,
  getOrDeleteUserSchema,
};
