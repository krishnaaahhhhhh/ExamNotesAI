const UserModel = require("../models/user.model.js");
const { getToken } = require("../utils/token.js");

const googleAuth = async (req, res) => {
    try {
        const { name, email, photo } = req.body;

        let user = await UserModel.findOne({ email });

        if (!user) {
            user = await UserModel.create({
                name,
                email,
                photo: photo || ""
            });
        } else {
            // Update photo in case it changed
            if (photo) user.photo = photo;
            await user.save();
        }

        let token = await getToken(user._id);

        // ✅ Set JWT in HttpOnly cookie (secure in production, lax in dev)
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        return res.status(200).json({ success: true, user, token });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { googleAuth, logout };
