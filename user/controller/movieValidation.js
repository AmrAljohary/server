const Joi = require("joi");
const create_series_movieValidation = {
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

            Runtime: Joi.object()
                .keys({
                    hours: Joi.number().integer().required(),
                    minutes: Joi.number().integer().required(),
                    seconds: Joi.number().integer().required(),
                })
                .required(),
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
            VideoUrl: Joi.string().required(),
            series: Joi.object().keys({
                    Title: Joi.string(Joi.ref('Title')).required(),
                    Year: Joi.number().integer().min(Joi.ref('Year')),
                    Released: Joi.date(Joi.ref('Released')).required(),
                    Runtime: Joi.object(Joi.ref('Runtime')).required(),
                    Genre: Joi.object(Joi.ref('Genre')).required(),
                    Description: Joi.string().min(Joi.ref('Description')).required(),
                    Language: Joi.string(Joi.ref('Language')).required(),
                    Poster: Joi.string(Joi.ref('Poster')).required(),
                    Rating: Joi.number(Joi.ref('Rating')).required(),
                    VideoUrl: Joi.string().required('VideoUrl'),

                })
                .required(),

        })
}


const editseriesValidation = {
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

        Runtime: Joi.object()
            .keys({
                hours: Joi.number().integer().required(),
                minutes: Joi.number().integer().required(),
                seconds: Joi.number().integer().required(),
            })
            .required(),
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
        VideoUrl: Joi.string().required(),
    })
};

module.exports = {
    create_series_movieValidation,
    editseriesValidation,
};