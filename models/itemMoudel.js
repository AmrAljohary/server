const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    name: String,
    type: String,
    uploaded_at: String,
    created_at: String,
    url: String,
    downloadUrl: String,
});

module.exports = itemSchema;