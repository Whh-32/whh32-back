const Joi = require('joi');

const createItemSchema = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
    'string.min': 'Item name must be at least 3 characters long',
    'string.max': 'Item name must not exceed 100 characters',
    'any.required': 'Item name is required',
  }),
  description: Joi.string().max(500).optional(),
  price: Joi.number().positive().precision(2).required().messages({
    'number.positive': 'Price must be a positive number',
    'any.required': 'Price is required',
  }),
  category: Joi.string().max(50).optional(),
});

const updateItemSchema = Joi.object({
  name: Joi.string().min(3).max(100).optional(),
  description: Joi.string().max(500).optional(),
  price: Joi.number().positive().precision(2).optional(),
  category: Joi.string().max(50).optional(),
}).min(1);

module.exports = {
  createItemSchema,
  updateItemSchema,
};
