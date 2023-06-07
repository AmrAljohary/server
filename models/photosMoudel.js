const mongoose = require("mongoose");

const photosSchema = new mongoose.Schema({
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
    ViewUrl: String,
});

photosSchema.virtual("photoCount").get(function() {
    return this.length;
});

const Photos = mongoose.model("photos", photosSchema, "photos");

module.exports = { Photos };