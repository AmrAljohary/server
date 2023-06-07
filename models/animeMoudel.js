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
    subtitle: String,
    Poster: String,
    Rating: Number,
    VideoUrl: String,
});

const seasonSchema = new mongoose.Schema({
    number: Number,
    name: String,
    image: String,
    Episodes: [episodeSchema],
});

const animeSchema = new mongoose.Schema({
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
    subtitle: String,
    Poster: String,
    Rating: Number,
    Seasons: [seasonSchema],
});
seasonSchema.virtual("EpisodesCountInSeason").get(function() {
    return this.Episodes.length;
});
animeSchema.virtual("SeasonsCount").get(function() {
    return this.Seasons.length;
});

animeSchema.virtual("EpisodesCount").get(function() {
    return this.Seasons.reduce(
        (total, season) => total + season.Episodes.length,
        0
    );
});

const Anime = mongoose.model("anime", animeSchema, "anime");

module.exports = { Anime };