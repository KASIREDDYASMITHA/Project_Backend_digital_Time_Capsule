const Joi = require("joi");

const capsuleSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().allow("").optional(),
  content: Joi.string().min(5).required(),
  theme: Joi.string().allow("").optional(),
  unlockDate: Joi.date().greater("now").required().messages({
    "date.greater": "Unlock date must be in the future",
    "date.base": "Unlock date must be a valid date",
  }),
});

module.exports = capsuleSchema;
