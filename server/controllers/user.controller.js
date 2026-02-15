const User = require("../models/user.model"); // import ki jagah require

const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId; 
        // req.userId humne isAuth middleware mein set kiya hai
        const user = await User.findById(userId).select("-password");
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }   
        return res.status(200).json(user);
    }
    catch (error) {
        console.log("Controller Error:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }   
}

// export default ki jagah module.exports
module.exports = { getCurrentUser };