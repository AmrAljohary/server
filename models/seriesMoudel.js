const mongoose = require("mongoose");

const episodeSchema = new mongoose.Schema({
    Title: String,
    Year: Number,
    Released: Date,
    EpisodeNumber: Number,
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
});

const seasonSchema = new mongoose.Schema({
    number: Number,
    name: String,
    Episodes: [episodeSchema],
});

const seriesSchema = new mongoose.Schema({
    Title: String,
    Year: Number,
    Released: Date,
    Genre: {
        type: mongoose.Schema.Types.Mixed,
        category: mongoose.Schema.Types.Mixed,
        subCategory: mongoose.Schema.Types.Mixed,
    },
    Description: String,
    Language: String,
    Poster: String,
    Rating: Number,
    Seasons: [seasonSchema],
});

seriesSchema.virtual("EpisodesCount").get(function() {
    return this.Seasons.reduce(
        (total, season) => total + (season.Chapters ? season.Episodes.length : 0),
        0)
});

seasonSchema.virtual("AllEpisodes").get(function() {
    return this.Episodes.length;
});
seriesSchema.virtual("AllSeasons").get(function() {
    return this.Seasons.length;
});

const Series = mongoose.model("series", seriesSchema, "series");

module.exports = { Series };