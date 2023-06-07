const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
    Title: String,
    Year: Number,
    Released: Date,
    Runtime: {
        hours: Number,
        minutes: Number,
        seconds: Number,
    },
    Genre: {
        type: mongoose.Schema.Types.Mixed,
        category: mongoose.Schema.Types.Mixed,
        subCategory: mongoose.Schema.Types.Mixed,
    },
    Description: String,
    Language: String,
    Poster: String,
    Rating: Number,
    VideoUrl: String,
    series: [{
        Title: String,
        Year: Number,
        Released: Date,
        Runtime: {
            hours: Number,
            minutes: Number,
            seconds: Number,
        },
        Genre: {
            type: mongoose.Schema.Types.Mixed,
            category: mongoose.Schema.Types.Mixed,
            subCategory: mongoose.Schema.Types.Mixed,
        },
        Description: String,
        Language: String,
        Poster: String,
        Rating: Number,
        VideoUrl: String,
    }, ],
});

const Movie = mongoose.model("Movie", movieSchema, "movie");

module.exports = { Movie };