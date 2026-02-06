const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

require("dotenv").config();

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ where: { username } });

        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.json({ token });

    } catch (err) {
        console.error("Login error:", err);
        console.log("You probably miss the .env file with the JWT_SECRET variable, in the BACK folder.")
        res.status(500).json({ message: "Internal server error" });
    }
};