const express = require("express");
const { Manga } = require("../models/mangaMoudel");
const router = express.Router();
const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const HandelValidation = require("../Middleware/HandelValidation");
const {
    mangaValidation,
    create_editVolumeValidation,
    edit_mangaValidation,
    create_editChapterValidation,
} = require("../user/controller/mangaValidation");


//get     checked
router.get("/", async(req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Current page number
        const limit = 10; // Number of results per page

        // Calculate the skip value based on the page and limit
        const skip = (page - 1) * limit;

        // Retrieve manga from the database with pagination
        const manga = await Manga.find().skip(skip).limit(limit).lean();

        const mangaDocuments = manga.map((mangaObject) => new Manga(mangaObject));

        // Get the total count of documents in the Manga collection
        const totalCount = await Manga.countDocuments();

        // Calculate the total number of pages based on the totalCount and limit
        const totalPages = Math.ceil(totalCount / limit);

        if (page > totalPages) {
            // Return a message indicating the last available page
            return res.json({
                message: `Invalid page number. The last available page is ${totalPages}`,
            });
        }

        res.json({
            data: mangaDocuments.map((doc) => doc.toObject({ virtuals: true })),
            totalPages: totalPages,
        });
    } catch (error) {
        console.error("Error retrieving manga:", error);
        res.status(500).json({ error: "An error occurred" });
    }
});


//search    checked
router.get("/search", async(req, res) => {
    try {
        const term = req.query.Title;
        const manga = await Manga.find({
            Title: { $regex: term, $options: "i" },
        }).lean();
        if (manga.length === 0) {
            return res.status(404).json("No manga found");
        }
        const mangaDocuments = manga.map((mangaObject) => new Manga(mangaObject));
        res.json(mangaDocuments.map((doc) => doc.toObject({ virtuals: true })));
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});
//############## manga #################
//delete manga    checked
router.delete("/:id", async(req, res) => {
    try {
        const manga = await Manga.findByIdAndDelete(req.params.id);
        if (!manga) {
            return res.status(404).json({ msg: "manga not found" });
        }
        res.json({ msg: "manga deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});
//create manga checked
router.post("/createManga", HandelValidation(mangaValidation), async(req, res) => {
    const {
        Title,
        Year,
        Released,
        Genre,
        Description,
        Language,
        Poster,
        Rating,
        volumeNumber,
        volumeName,
    } = req.body;

    // Create a new season document with the episode
    const newVolume = {
        number: volumeNumber,
        name: volumeName,
        Chapters: [],
    };
    // Create a new anime document with the season
    const newManga = new Manga({
        Title,
        Year,
        Released,
        Genre,
        Description,
        Language,
        Poster,
        Rating,
        Volumes: [newVolume],
    });
    // Save the new anime document to the database
    await newManga.save();

    // Retrieve the newly created anime document
    const manga = await Manga.findById(newManga._id);

    res.json({ msg: "manga added successfully", manga });
});
//edit anime  checked
router.post("/editManga/:id", HandelValidation(edit_mangaValidation), async(req, res) => {
    const mangaId = req.params.id;
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
        } = req.body;
        const updatedManga = await Manga.findByIdAndUpdate(
            mangaId, {
                $set: {
                    Title,
                    Year,
                    Released,
                    Genre,
                    Description,
                    Language,
                    Poster,
                    Rating,
                },
            }, { new: true }
        );

        if (!updatedManga) {
            return res.status(404).json({
                msg: "Manga not found",
            });
        }

        res.json({
            msg: "Manga updated successfully",
            anime: updatedManga,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: "Server error",
        });
    }
});
//############## volume #################
//create volume   checked
router.post("/createVolume/:id", async(req, res) => {
    const mangaId = req.params.id;
    const { number, name } = req.body; // assuming number and name are sent in the request body
    const newVolume = { number, name, Chapters: [] }; // add number and name to the newSeason object

    const updatedManga = await Manga.findOneAndUpdate({ _id: mangaId }, { $push: { Volumes: newVolume } }, { new: true }).populate("Volumes.Chapters");

    res.json({
        msg: "Volume added successfully",
        manga: updatedManga,
    });
});
//edit volume  checked
router.post("/editVolume/:mangaId/:volumeNumber", HandelValidation(create_editVolumeValidation), async(req, res) => {
    const { name, number } = req.body;
    const updatedVolume = { name, number };

    const updatedManga = await Manga.findOneAndUpdate({
        _id: req.params.mangaId,
        "Volumes.number": req.params.volumeNumber,
    }, { $set: { "Volumes.$": updatedVolume } }, { new: true }).populate("Volumes.Chapters");

    res.json({
        msg: "Volume updated successfully",
        manga: updatedManga,
    });
});
//delete volume  checked
router.delete("/deleteVolume/:mangaId/:volumeNumber", async(req, res) => {
    const updatedVolume = await Manga.findOneAndUpdate({ _id: req.params.mangaId }, { $pull: { Volumes: { number: req.params.volumeNumber } } }, // remove the season matching the seasonNumber parameter
        { new: true }
    ).populate("Volumes.Chapters");

    res.json({
        msg: "Volume deleted successfully",
        manga: updatedVolume,
    });
});
//############## episode #################
//crate chapter    checked
router.post("/createChapter/:mangaId/:volumeNumber", HandelValidation(create_editChapterValidation), async(req, res) => {
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
        ReadUrl,
        ChapterNumber,
    } = req.body;
    const newChapter = {
        Title,
        Year,
        Released,
        Runtime,
        Genre,
        Description,
        Language,
        Poster,
        Rating,
        ReadUrl,
        ChapterNumber,
    };

    const updatedManga = await Manga.findOneAndUpdate({ _id: req.params.mangaId, "Volumes.number": req.params.volumeNumber }, { $push: { "Volumes.$.Chapters": newChapter } }, { new: true });

    res.json({
        msg: "Chapter added successfully",
        manga: updatedManga,
    });
});
// edit chapter in volume       checked
router.post("/editChapter/:mangaId/:volumeNumber/:ChapterNumber", HandelValidation(create_editChapterValidation), async(req, res) => {
    const {
        Title,
        Year,
        Released,
        ChapterNumber,
        Runtime,
        Genre,
        Description,
        Language,
        Poster,
        Rating,
        ReadUrl,
    } = req.body;

    const updatedChapter = {
        Title,
        Year,
        Released,
        ChapterNumber,
        Runtime,
        Genre,
        Description,
        Language,
        Poster,
        Rating,
        ReadUrl,
    };

    const updatedManga = await Manga.findOneAndUpdate({
        _id: req.params.mangaId,
        "Volumes.number": req.params.volumeNumber,
        "Volumes.Chapters.ChapterNumber": req.params.ChapterNumber,
    }, {
        $set: { "Volumes.$[volume].Chapters.$[chapter]": updatedChapter },
    }, {
        new: true,
        arrayFilters: [{
                "volume.number": req.params.volumeNumber,
            },
            {
                "chapter.ChapterNumber": req.params.ChapterNumber,
            },
        ],
    });

    res.json({
        msg: "Chapter updated successfully",
        manga: updatedManga,
    });
});
//delete chapter in volume    checked
router.delete("/deleteChapter/:mangaId/:volumeNumber/:ChapterNumber",
    async(req, res) => {
        const updatedManga = await Manga.findOneAndUpdate({
            _id: req.params.mangaId,
            "Volumes.number": req.params.volumeNumber,
        }, {
            $pull: {
                "Volumes.$.Chapters": {
                    ChapterNumber: req.params.ChapterNumber,
                },
            },
        }, { new: true });

        res.json({
            msg: "Chapter deleted successfully",
            manga: updatedManga,
        });
    }
);
module.exports = router;