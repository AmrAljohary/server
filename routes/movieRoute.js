const express = require("express");
const { Movie } = require("../models/movieMoudel");
const { ObjectId } = require("mongodb");
const Joi = require("joi");
const router = express.Router();
const HandelValidation = require("../Middleware/HandelValidation");
// const {
//     create_series_movieValidation,
//     editseriesValidation,
// } = require("../user/controller/movieValidation"); 
//get    checked
router.get("/", async(req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Current page number
        const limit = 10; // Number of results per page

        // Calculate the skip value based on the page and limit
        const skip = (page - 1) * limit;

        // Retrieve movies from the database with pagination
        const movies = await Movie.find().skip(skip).limit(limit).lean();

        // Get the total count of documents in the Movie collection
        const totalCount = await Movie.countDocuments();

        // Calculate the total number of pages based on the totalCount and limit
        const totalPages = Math.ceil(totalCount / limit);

        if (page > totalPages) {
            // Return a message indicating the last available page
            return res.json({
                message: `Invalid page number. The last available page is ${totalPages}`,
            });
        }

        res.json({
            data: movies,
            totalPages: totalPages,
        });
    } catch (error) {
        console.error("Error retrieving movies:", error);
        res.status(500).json({ error: "An error occurred" });
    }
});
//delete   checked
router.delete("/:id", async(req, res) => {
    try {
        const movie = await Movie.findByIdAndDelete(req.params.id);
        if (!movie) {
            return res.status(404).json({ msg: "Movie not found" });
        }
        res.json({ msg: "Movie deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});
// create    checked
router.post(
    "/add",
    async(req, res) => {
        const {
            Title,
            Year,
            Released,
            Runtime,
            Genre,
            Description,
            Language,
            Poster,
            Rating,
            VideoUrl,
            series,
        } = req.body;

        const newMovie = new Movie({
            Title,
            Year,
            Released,
            Runtime,
            Genre,
            Description,
            Language,
            Poster,
            Rating,
            VideoUrl,
            series,
        });

        await newMovie.save();

        res.json({ msg: "Movie added successfully", movie: newMovie });
    }
);
// create series    checked
router.post(
    "/createSeries/:id",
    async(req, res) => {
        const movieId = req.params.id;

        const {
            Title,
            Year,
            Released,
            Runtime,
            Genre,
            Description,
            Language,
            Poster,
            Rating,
            VideoUrl,
            series,
        } = req.body;

        const newSeries = {
            Title,
            Year,
            Released,
            Runtime,
            Genre,
            Description,
            Language,
            Poster,
            Rating,
            VideoUrl,
            series
        };

        const updatedMovie = await Movie.findOneAndUpdate({ _id: movieId }, { $push: { series: newSeries } }, { new: true });

        res.json({ msg: "Series added successfully", movie: updatedMovie });
    }
);
// edit series    checked
router.post("/updateSeries/:id/:seriesIndex", async(req, res, next) => {
    const id = req.params.id;
    const seriesIndex = req.params.seriesIndex;
    const {
        Title,
        Year,
        Released,
        Runtime,
        Genre,
        Description,
        Language,
        Poster,
        Rating,
        VideoUrl,
    } = req.body;

    try {
        const objectId = new ObjectId(id);
        const movie = await Movie.findById(id);
        console.log(movie);
        if (!movie) {
            return res.status(404).send("Movie not found");
        }

        const series = movie.series[seriesIndex];
        console.log(series);
        if (!series) {
            return res.status(404).send("Series not found");
        }

        series.Title = Title || series.Title;
        series.Year = Year || series.Year;
        series.Released = Released || series.Released;
        series.Runtime = Runtime || series.Runtime;
        series.Genre = Genre || series.Genre;
        series.Description = Description || series.Description;
        series.Language = Language || series.Language;
        series.Poster = Poster || series.Poster;
        series.Rating = Rating || series.Rating;
        series.VideoUrl = VideoUrl || series.VideoUrl;

        await movie.save();

        res.json({ msg: "Series updated successfully", series });
    } catch (error) {
        return next(error);
    }
});
//delete series   checked
router.delete("/:id/:seriesIndex", async(req, res) => {
    try {
        const id = req.params.id;
        const seriesIndex = req.params.seriesIndex;
        const movie = await Movie.findById(id);

        if (!movie) {
            return res.status(404).json({ msg: "Movie not found" });
        }

        const series = movie.series[seriesIndex];
        if (!series) {
            return res.status(404).json({ msg: "Series not found" });
        }

        movie.series.splice(seriesIndex, 1); // remove the series from the array

        await movie.save(); // save the updated movie object to the database

        res.json({ msg: "Series deleted successfully", series });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});
//edit    checked
router.post("/:id", async(req, res, next) => {
    const id = req.params.id;
    const {
        Title,
        Year,
        Released,
        Runtime,
        Genre,
        Description,
        Language,
        Poster,
        Rating,
        VideoUrl,
        series,
    } = req.body;

    try {
        const objectId = new ObjectId(id);
        const result = await Movie.updateOne({ _id: objectId }, req.body);
        if (result.nModified === 0) return res.status(404).send("Movie not found");

        const updatedDoc = await Movie.findById(id);
        res.json(updatedDoc);
    } catch (error) {
        return next(error);
    }
});
//search    checked
router.get("/search", async(req, res) => {
    try {
        const term = req.query.Title;
        const movie = await Movie.find({ Title: { $regex: term, $options: "i" } });
        res.json(movie);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

module.exports = router;