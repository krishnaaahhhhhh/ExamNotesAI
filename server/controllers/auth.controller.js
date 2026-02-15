const UserModel = require("../models/user.model.js");
const { getToken } = require("../utils/token.js");

const googleAuth = async (req, res) => {
    try {
        const { name, email } = req.body;

        let user = await UserModel.findOne({ email });

        if (!user) {
            user = await UserModel.create({
                name,
                email
            });
        }

        let token = await getToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.status(200).json(user);
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
