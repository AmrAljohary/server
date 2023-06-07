const Joi = require('joi')



const create_edit_photoValidation = {
    body: Joi.object().keys({
        Title: Joi.string()
            .min(2)
            .messages({
                "string.empty": "Display title cannot be empty",
                "string.min": "Min 2 characters",
            })
            .required(),
        Year: Joi.number().integer().min(1900).max(2024).required(),
        Released: Joi.date().required(),
        Genre: Joi.object()
            .keys({
                Type: Joi.string().required(),
                Category: Joi.string().required(),
                SubCategory: Joi.string().required(),
            })
            .required(),
        Description: Joi.string().min(10).max(300).required(),
        Language: Joi.string().required(),
        Poster: Joi.string().required(),
        Rating: Joi.number().required(),
        ViewUrl: Joi.string().required()
    }),
};


module.exports = {
    create_edit_photoValidation
}