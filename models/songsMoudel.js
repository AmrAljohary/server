const mongoose = require("mongoose");

const songsSchema = new mongoose.Schema({
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
    PlayUrl: String,
});

const Songs = mongoose.model("songs", songsSchema, "songs");

module.exports = { Songs };