const Joi = require('joi');


const mangaValidation = {
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
        subtitle: Joi.string().required(),
        Poster: Joi.string().required(),
        Rating: Joi.number().required(),
        volumeNumber: Joi.number().required(),
        volumeName: Joi.string().required()
    }),
};



const create_editVolumeValidation = {
    body: Joi.object().keys({
        number: Joi.number().required(),
        name: Joi.string().required(),
    })
}

const edit_mangaValidation = {
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
        subtitle: Joi.string().required(),
        Poster: Joi.string().required(),
        Rating: Joi.number().required(),

    })

}

const create_editChapterValidation = {
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
        subtitle: Joi.string().required(),
        Poster: Joi.string().required(),
        Rating: Joi.number().required(),
        ReadUrl: Joi.string().required(),
        ChapterNumber: Joi.string().required(),
    }),
};

module.exports = {
    mangaValidation,
    create_editVolumeValidation,
    edit_mangaValidation,
    create_editChapterValidation,
};