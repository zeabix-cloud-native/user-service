const Joi = require('joi');

const createUserRequestValidator = Joi.object({
    user_id:   Joi.string(),
    firstname: Joi.string()
                .alphanum()
                .min(3)
                .max(16)
                .required(),
    lastname: Joi.string()
                .alphanum()
                .min(3)
                .max(16)
                .required(),
    mobile: Joi.string()
                .pattern(new RegExp('^[0][0-9]{9}$'))
                .min(9)
                .max(10)
                .required(),
    org_id: Joi.string()
                .alphanum()
                .required()
});

module.exports = {
    createUserRequestValidator
}