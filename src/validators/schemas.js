const Joi = require('joi');

/**
 * Validation Schemas
 * Centralized validation rules using Joi
 */

const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required().messages({
    'string.alphanum': 'Username must only contain alphanumeric characters',
    'string.min': 'Username must be at least 3 characters long',
    'string.max': 'Username must not exceed 30 characters',
    'any.required': 'Username is required',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(6).max(100).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'string.max': 'Password must not exceed 100 characters',
    'any.required': 'Password is required',
  }),
  firstName: Joi.string().min(2).max(50).optional(),
  lastName: Joi.string().min(2).max(50).optional(),
});

const loginSchema = Joi.object({
  username: Joi.string().required().messages({
    'any.required': 'Username is required',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required',
  }),
});

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
  registerSchema,
  loginSchema,
  createItemSchema,
  updateItemSchema,
};
