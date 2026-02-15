const jsonwebtoken = require("jsonwebtoken");
const getToken = async (userId) => {
    try {
        const token = jsonwebtoken.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1d" });
        console.log(token)
        return token;
    } catch (error) {
        throw error;
    }
    
}
module.exports = { getToken };