const express = require("express");
const multer = require("multer");
const upload = multer();
const router = express.Router();
const mongoose = require("mongoose");
const Joi = require("joi");
const itemSchema = require("../models/itemMoudel");
require("dotenv").config();
const baseURL = process.env.Base_url; // Replace with your API endpoint
// Create a model based on the schema
const Item = mongoose.model("Item", itemSchema);
// Joi schema for request validation
const uploadSchema = Joi.object({
    jsonData: Joi.string().required(),
});

router.post("/upload", upload.none(), async(req, res) => {
    try {
        // Validate the request body
        const { error } = uploadSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const jsonData = JSON.parse(req.body.jsonData);

        // Filter and modify the data
        const filteredData = {
            images: jsonData
                .filter((item) => item.type === "image")
                .map((item) => ({
                    ...item,
                    url: `${baseURL}${item.id}?raw=1`,
                    downloadUrl: `${baseURL}${item.id}?raw=1&dl=1`,
                })),
            audios: jsonData
                .filter((item) => item.type === "audio")
                .map((item) => ({
                    ...item,
                    url: `${baseURL}${item.id}?raw=1`,
                    downloadUrl: `${baseURL}${item.id}?raw=1&dl=1`,
                })),
            videos: jsonData
                .filter((item) => item.type === "video")
                .map((item) => ({
                    ...item,
                    url: `${baseURL}${item.id}?raw=1`,
                    downloadUrl: `${baseURL}${item.id}?raw=1&dl=1`,
                })),
            documents: jsonData
                .filter((item) => item.type === "document")
                .map((item) => ({
                    ...item,
                    url: `${baseURL}${item.id}?raw=1`,
                    downloadUrl: `${baseURL}${item.id}?raw=1&dl=1`,
                })),
            subtitle: jsonData
                .filter((item) => item.type === null || item.type === "unknown")
                .map((item) => ({
                    ...item,
                    url: `${baseURL}${item.id}?raw=1`,
                    downloadUrl: `${baseURL}${item.id}?raw=1&dl=1`,
                })),
        };

        // Add each item to the database
        for (const [type, items] of Object.entries(filteredData)) {
            try {
                // Create a collection based on the type
                const collectionName = `${type}Link`;
                const CollectionItem = mongoose.model(collectionName, itemSchema);

                // Insert items into the collection
                await CollectionItem.insertMany(items);
                console.log(`Saved ${type} items to database`);
            } catch (error) {
                console.error(`Error saving ${type} items to database:`, error);
            }
        }

        return res
            .status(200)
            .json({ message: "Data received and processed successfully." });
    } catch (error) {
        console.error("Error parsing JSON data:", error);
        return res.status(400).json({ error: "Invalid JSON data." });
    }
});

module.exports = router;