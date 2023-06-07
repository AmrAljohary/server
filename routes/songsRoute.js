const express = require("express");
const router = express.Router();
const { Songs } = require("../models/songsMoudel");
const HandelValidation = require("../Middleware/HandelValidation");
const {
    create_edit_songsValidation,
} = require("../user/controller/songsValidation");

// get all songs   checked
router.get("/", async(req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Current page number
        const limit = 10; // Number of results per page

        // Calculate the skip value based on the page and limit
        const skip = (page - 1) * limit;

        // Retrieve songs from the database with pagination
        const songs = await Songs.find()
            .skip(skip)
            .limit(limit)
            .lean({ virtuals: true });

        // Get the total count of documents in the Songs collection
        const totalCount = await Songs.countDocuments();

        // Calculate the total number of pages based on the totalCount and limit
        const totalPages = Math.ceil(totalCount / limit);

        if (page > totalPages) {
            // Return a message indicating the last available page
            return res.json({
                message: `Invalid page number. The last available page is ${totalPages}`,
            });
        }

        res.json({
            data: songs,
            totalPages: totalPages,
        });
    } catch (error) {
        console.error("Error retrieving songs:", error);
        res.status(500).json({ error: "An error occurred" });
    }
});



// search songs by title checked
router.get("/search", async(req, res) => {
    try {
        const term = req.query.Title;
        const songs = await Songs.find({
            Title: { $regex: term, $options: "i" },
        }).lean();
        if (songs.length === 0) {
            return res.status(404).json("No songs found");
        }
        const songDocuments = songs.map((songObject) => new Songs(songObject));
        res.json(songDocuments.map((doc) => doc.toObject({ virtuals: true })));
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

// delete a song by id  checked
router.delete("/:id", async(req, res) => {
    try {
        const song = await Songs.findByIdAndDelete(req.params.id);
        if (!song) {
            return res.status(404).json({ msg: "Song not found" });
        }
        res.json({ msg: "Song deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

// create a new song   checked
router.post("/createSong", HandelValidation(create_edit_songsValidation), async(req, res) => {
    const {
        Title,
        Year,
        Released,
        Genre,
        Description,
        Language,
        Poster,
        Rating,
        PlayUrl,
    } = req.body;

    const newSong = new Songs({
        Title,
        Year,
        Released,
        Genre,
        Description,
        Language,
        Poster,
        Rating,
        PlayUrl,
    });

    await newSong.save();

    res.json({ msg: "Song added successfully", song: newSong });
});

// update an existing song  checked
router.post("/editSong/:id", HandelValidation(create_edit_songsValidation), async(req, res) => {
    const songId = req.params.id;
    try {
        const {
            Title,
            Year,
            Released,
            Genre,
            Description,
            Language,
            Poster,
            Rating,
            PlayUrl,
        } = req.body;
        const updatedSong = await Songs.findByIdAndUpdate(
            songId, {
                $set: {
                    Title,
                    Year,
                    Released,
                    Genre,
                    Description,
                    Language,
                    Poster,
                    Rating,
                    PlayUrl,
                },
            }, { new: true }
        );

        if (!updatedSong) {
            return res.status(404).json({
                msg: "Song not found",
            });
        }

        res.json({
            msg: "Song updated successfully",
            song: updatedSong,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: "Server error",
        });
    }
});

module.exports = router;