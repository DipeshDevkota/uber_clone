const { validationResult } = require("express-validator");
const CaptainModel = require("../db/models/captain.model");
const { hashPassword, comparePasswords } = require("../utils/auth");
const jwt = require('jsonwebtoken');

const registerCaptain = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { fullname, email, password, vehicle } = req.body;

        if (!fullname || !email || !password || !vehicle) {
            return res.status(400).json({ message: "Invalid request structure." });
        }
       
        const existingCaptain = await CaptainModel.findOne({ email });
        if (existingCaptain) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // Hash password
        const hashedPassword = await hashPassword(password);
        console.log("Registration - Password details:");
        console.log("Original:", password);
        console.log("Hashed:", hashedPassword);

        const captain = new CaptainModel({
            fullname: {
                firstname: fullname.firstname,
                lastname: fullname.lastname
            },
            email,
            password: hashedPassword,
            vehicle: {
                color: vehicle.color,
                plate: vehicle.plate,
                capacity: vehicle.capacity,
                vehicleType: vehicle.vehicleType
            }
        });

        await captain.save();
        
        // Verify the stored password immediately after save
        const savedCaptain = await CaptainModel.findOne({ email });
        console.log("Verification - Stored hashed password:", savedCaptain.password);

        res.status(201).json({
            message: "Registration successful!",
            captain: {
                fullname: captain.fullname,
                email: captain.email,
                vehicle: captain.vehicle
            }
        });

    } catch (error) {
        console.error("Registration error:", error);
        return res.status(400).json({ error: error.message });
    }
};

const loginCaptain = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({ message: "All fields are required!" });
        }

        const captain = await CaptainModel.findOne({ email });
        if (!captain) {
            return res.status(401).json({ message: "Captain doesn't exist!" });
        }

  
        const isMatch = await comparePasswords(password, captain.password);
        console.log("Password match result:", isMatch);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials!" });
        }

        const token = jwt.sign(
            { _id: captain._id },
            process.env.SECRET_KEY,
            { expiresIn: "1d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "strict",
        });

        res.status(200).json({
            message: "Login successful",
            captain: {
                fullname: captain.fullname,
                email: captain.email,
                vehicle: captain.vehicle
            },
            token
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Server error while logging in", error: error.message });
    }
};

// ... rest of the code remains the same ...


const getProfile= async(req,res)=>{
    try {
    const captain = req.captain
   

        console.log("Captain is ",captain);

        res.send({message:"User's profile is:",captain})


        
    } catch (error) {

        console.log("Server error")
        return res.status(401).json(error.message)
        

    }

}


const blacklist = new Set(); // Temporary in-memory blacklist, replace with a persistent store for production use

const logoutCaptain = async (req, res) => {
    try {
        // Step 1: Extract the token from cookies or authorization headers
        const token = req.cookies?.token || (req.headers.authorization && req.headers.authorization.split(" ")[1]);

        if (!token) {
            return res.status(400).json({ message: "No token found. User is already logged out or session is invalid." });
        }

        // Step 2: Blacklist the token (optional, replace with a database or Redis for production use)
        blacklist.add(token);

        // Optional: Set an expiry for the blacklist token (e.g., 24 hours)
        setTimeout(() => {
            blacklist.delete(token);
        }, 24 * 60 * 60 * 1000); // 24 hours in milliseconds

        // Step 3: Clear the token cookie
        res.cookie("token", null, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",  // Set secure to true in production only
            sameSite: "strict",
            expires: new Date(Date.now()),
        });
        

        // Step 4: Send a success response
        return res.status(200).json({ message: "User logged out successfully!" });
    } catch (error) {
        // Step 5: Log and handle errors
        console.error("Logout error:", error);

        return res.status(500).json({
            message: "An internal server error occurred during logout. Please try again later.",
            error: error.message,
        });
    }
};
// ... rest of the code remains the same ...

module.exports = { registerCaptain, loginCaptain,getProfile,logoutCaptain };