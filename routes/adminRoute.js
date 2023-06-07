const express = require("express");
const Admin = require("../models/adminMoudel");
const router = express.Router();
const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const upload = multer();
router.use(express.json());

// Generate an access token
const generateAccessToken = (admin) => {
    // Set the expiration time for the token (e.g., 1 hour)
    const expiresIn = "1h";

    // Set the secret key for signing the token (keep it secure)
    const secretKey = "your-secret-key";

    // Create the payload for the token
    const payload = {
        id: admin.id,
        email: admin.email,
        role: admin.role,
    };

    // Generate the token using the payload, secret key, and expiration time
    const token = jwt.sign(payload, secretKey, { expiresIn });

    return token;
};

router.post("/login", upload.none(), async(req, res) => {
    const { email, password } = req.body;
    try {
        // Find the admin by email
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        // Compare the entered password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, admin.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // Password is valid, proceed with login

        // Generate an access token
        const accessToken = generateAccessToken(admin);

        // Customize the response structure with the required data
        const response = {
            message: "Login successful",
            ability: [{ action: "manage", subject: "all" }],
            accessToken,
            avatar: admin.avatar,
            avatar: "https://c4.wallpaperflare.com/wallpaper/215/146/548/bleach-anime-mask-bankai-wallpaper-preview.jpg",
            email: admin.email,
            extras: { eCommerceCartItemsCount: 2 },
            id: admin.id,
            role: admin.role,
            username: admin.username,
        };

        return res.status(200).json(response);
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// ...

router.post("/register", async(req, res) => {
    const { email, password, username } = req.body;

    try {
        // Check if the admin already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: "Admin already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new admin with the hashed password
        const newAdmin = new Admin({
            email,
            password: hashedPassword,
            username,
        });

        // Save the admin to the database
        await newAdmin.save();

        return res.status(201).json({ message: "Admin created successfully" });
    } catch (error) {
        console.error("Error during registration:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});


module.exports = router;