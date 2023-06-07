const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema({
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
    ReadUrl: String,
    ChapterNumber: Number,
});

const volumeSchema = new mongoose.Schema({
    number: Number,
    name: String,
    Chapters: [chapterSchema],
});

const mangaSchema = new mongoose.Schema({
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
    Volumes: [volumeSchema],
});
volumeSchema.virtual("ChaptersCountInVolume").get(function() {
    return this.Chapters ? this.Chapters.length : 0;
});


mangaSchema.virtual("VolumesCount").get(function() {
    return this.Volumes.length;
});

mangaSchema.virtual("ChaptersCount").get(function() {
    return this.Volumes.reduce(
        (total, Volume) => total + (Volume.Chapters ? Volume.Chapters.length : 0),
        0
    );
});

const Manga = mongoose.model("Manga", mangaSchema, "manga");

module.exports = { Manga };