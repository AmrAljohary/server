const Joi = require("joi");
const seriesValidation = {
    body: Joi.object()
        .keys({
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
            seasonNumber: Joi.number().required(),
            seasonName: Joi.string().required(),
            seasonImage: Joi.string().required(),
        })
        .required(),
};
const create_editSeasonValidation = {
    body: Joi.object().keys({
        number: Joi.number().required(),
        name: Joi.string().required(),
        image: Joi.string().required(),
    }),
};

const editSeriesValidation = {
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
    }).required(),
};
const create_editEpisodeValidation = {
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
        Runtime: Joi.object()
            .keys({
                hours: Joi.number().min(1).required(),
                minutes: Joi.number().min(1).required(),
                seconds: Joi.number().min(1).required(),
            })
            .required(),
        Description: Joi.string().min(10).max(300).required(),
        Language: Joi.string().required(),
        subtitle: Joi.string().required(),
        Poster: Joi.string().required(),
        Rating: Joi.number().required(),
        VideoUrl: Joi.string().required(),
        EpisodeNumber: Joi.number().required(),
    }),
};

module.exports = {
    seriesValidation,
    create_editSeasonValidation,
    create_editEpisodeValidation,
    editSeriesValidation,


}