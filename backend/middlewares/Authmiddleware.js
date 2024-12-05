const UserModel = require("../db/models/user.model");
const jwt = require("jsonwebtoken");

const AuthUser = async (req, res, next) => {
  try {
    // console.log("Request body received:", req.body);

    const token = req.cookies?.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    //  console.log("Token in authuser is ",token)
    if (!token) {
      return res.status(401).json({ message: "Unauthorized! Token missing." });
    }

    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    const { _id } = decodedToken;

    const user = await UserModel.findById(_id).select("firstname lastname");
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("Error in AuthUser middleware:", error.message);
    return res.status(500).json({ message: "Internal Server Error. Please try again." });
  }
};

module.exports = { AuthUser };
