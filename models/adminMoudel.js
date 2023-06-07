const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["client", "admin"],
        default: "client",
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
});


const Admin = mongoose.model("admin", adminSchema, "admin");

module.exports = Admin;