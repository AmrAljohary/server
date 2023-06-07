const express = require("express");
const { Photos } = require("../models/photosMoudel");
const router = express.Router();
const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const HandelValidation = require("../Middleware/HandelValidation");
const {
    create_edit_photoValidation,
} = require("../user/controller/photoValidation");
//get checked
router.get("/", async(req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Current page number
        const limit = 10; // Number of results per page

        // Calculate the skip value based on the page and limit
        const skip = (page - 1) * limit;

        // Retrieve photos from the database with pagination
        const photos = await Photos.find()
            .skip(skip)
            .limit(limit)
            .lean({ virtuals: true });

        // Get the total count of documents in the Photos collection
        const totalCount = await Photos.countDocuments();

        // Calculate the total number of pages based on the totalCount and limit
        const totalPages = Math.ceil(totalCount / limit);

        if (page > totalPages) {
            // Return a message indicating the last available page
            return res.json({
                message: `Invalid page number. The last available page is ${totalPages}`,
            });
        }

        res.json({
            data: photos,
            totalPages: totalPages,
        });
    } catch (error) {
        console.error("Error retrieving photos:", error);
        res.status(500).json({ error: "An error occurred" });
    }
});


//search    checked
router.get("/search", async(req, res) => {
    try {
        const term = req.query.Title;
        const photos = await Photos
            .find({
                Title: { $regex: term, $options: "i" },
            })
            .lean();
        if (photos.length === 0) {
            return res.status(404).json("No photos found");
        }
        const photosDocuments = photos.map(
            (photosObject) => new Photos(photosObject)
        );
        res.json(
            photosDocuments.map((doc) => doc.toObject({ virtuals: true }))
        );
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});
//delete photo    checked
router.delete("/:id", async(req, res) => {
    try {
        const photos = await Photos.findByIdAndDelete(req.params.id);
        if (!photos) {
            return res.status(404).json({ msg: "photo not found" });
        }
        res.json({ msg: "photo deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});
//create photo checked
router.post("/createPhoto", HandelValidation(create_edit_photoValidation), async(req, res) => {
    const {
        Title,
        Year,
        Released,
        Genre,
        Description,
        Language,
        Poster,
        Rating,
        ViewUrl,
    } = req.body;

    const newPhoto = new Photos({
        Title,
        Year,
        Released,
        Genre,
        Description,
        Language,
        Poster,
        Rating,
        ViewUrl,
    });

    await newPhoto.save();

    res.json({ msg: "Photo added successfully", photo: newPhoto });
});
//edit photo  checked
router.post("/editPhoto/:id", HandelValidation(create_edit_photoValidation), async(req, res) => {
    const photoId = req.params.id;
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
            ViewUrl,
        } = req.body;
        const updatedPhoto = await Photos.findByIdAndUpdate(
            photoId, {
                $set: {
                    Title,
                    Year,
                    Released,
                    Genre,
                    Description,
                    Language,
                    Poster,
                    Rating,
                    ViewUrl,
                },
            }, { new: true }
        );

        if (!updatedPhoto) {
            return res.status(404).json({
                msg: "Photo not found",
            });
        }

        res.json({
            msg: "Photo updated successfully",
            photo: updatedPhoto,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: "Server error",
        });
    }
});

module.exports = router;