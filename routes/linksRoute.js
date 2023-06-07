const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const multer = require("multer");
const itemSchema = require("../models/itemMoudel");

// Create a route to get images
router.get("/images", async(req, res) => {
    try {
        // Retrieve images from the "imagesLink" collection and sort by uploaded_at in ascending order
        const ImageItem = mongoose.model("imagesLink", itemSchema);
        const images = await ImageItem.find({}, {
            name: 1,
            type: 1,
            uploaded_at: 1,
            id: 1,
            url: 1,
            downloadUrl: 1,
        }).sort({ uploaded_at: 1 });

        return res.status(200).json(images);
    } catch (error) {
        console.error("Error retrieving images:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
});
// Create a route to get video
router.get("/videos", async(req, res) => {
    try {
        // Retrieve video from the "imvideoagesLink" collection and sort by uploaded_at in ascending order
        const videoItem = mongoose.model("videosLink", itemSchema);
        const videos = await videoItem
            .find({}, {
                name: 1,
                type: 1,
                uploaded_at: 1,
                id: 1,
                url: 1,
                downloadUrl: 1,
            })
            .sort({ uploaded_at: 1 });

        return res.status(200).json(videos);
    } catch (error) {
        console.error("Error retrieving videos:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
});
// Create a route to get images
router.get("/images", async(req, res) => {
    try {
        // Retrieve images from the "imagesLink" collection and sort by uploaded_at in ascending order
        const ImageItem = mongoose.model("imagesLink", itemSchema);
        const images = await ImageItem.find({}, {
            name: 1,
            type: 1,
            uploaded_at: 1,
            id: 1,
            url: 1,
            downloadUrl: 1,
        }).sort({ uploaded_at: 1 });

        return res.status(200).json(images);
    } catch (error) {
        console.error("Error retrieving images:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
});
// Create a route to get images
router.get("/images", async(req, res) => {
    try {
        // Retrieve images from the "imagesLink" collection and sort by uploaded_at in ascending order
        const ImageItem = mongoose.model("imagesLink", itemSchema);
        const images = await ImageItem.find({}, {
            name: 1,
            type: 1,
            uploaded_at: 1,
            id: 1,
            url: 1,
            downloadUrl: 1,
        }).sort({ uploaded_at: 1 });

        return res.status(200).json(images);
    } catch (error) {
        console.error("Error retrieving images:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
});
// Create a route to get images
router.get("/images", async(req, res) => {
    try {
        // Retrieve images from the "imagesLink" collection and sort by uploaded_at in ascending order
        const ImageItem = mongoose.model("imagesLink", itemSchema);
        const images = await ImageItem.find({}, {
            name: 1,
            type: 1,
            uploaded_at: 1,
            id: 1,
            url: 1,
            downloadUrl: 1,
        }).sort({ uploaded_at: 1 });

        return res.status(200).json(images);
    } catch (error) {
        console.error("Error retrieving images:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
});
module.exports = router;