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

}


const logoutCaptain = async(req,res)=>{

}
// ... rest of the code remains the same ...

module.exports = { registerCaptain, loginCaptain,getProfile,logoutCaptain };