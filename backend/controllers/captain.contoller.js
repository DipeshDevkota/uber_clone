const { validationResult } = require("express-validator");
const CaptainModel = require("../db/models/captain.model")
const captainService = require("../services/captain.service");
const bcrypt = require('bcrypt');
const Captain = require("../db/models/captain.model");
const registerCaptain = async(req,res)=>{
    try {
      
        const errors = validationResult(req);
        if(!errors.isEmpty())
        {
            return res.status(400).json({errors:errors.array()})
        }
        

        const {fullname, email,password,vehicle} = req.body;
       
        if(!fullname || !email || !password || !vehicle )
        {
            return res.status(400).json({message:"Invalid request structure."})
        }
        const captainexists= await CaptainModel.findOne({email});

        if(captainexists)
        {
            return res.status(400).json({message:"Captain already exists!"});
        }
        
        const hashedPassword= await CaptainModel.hashPassword(password);

        const captain = await captainService.createModel({
            firstname:fullname.firstname,
            lastname:fullname.lastname,
            email,
            password:hashedPassword,
            color:vehicle.color,
            plate:vehicle.plate,
            capacity:vehicle.capacity,
            vehicleType:vehicle.vehicleType

        });

        await captain.save();

        // const token = captain.generateAuthToken();
        
        res.status(201).json({
            message:"You have been registered!",
            // token,
            captain
        });
        
    } catch (error) {
        console.error("Internal Server Error");
        return res.status(400).json({error:error.message})
        
    }
}




const loginCaptain = async (req, res) => {
    try {
        // Validation for required fields


        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({ message: "All fields are required!" });
        }

        // Fetch captain from database
        const captain = await CaptainModel.findOne({ email });
        if (!captain) {
            return res.status(401).json({ message: "Captain doesn't exist!" });
        }

        // Debugging: Log fetched password and plain password
        console.log("Fetched captain password:", captain.password);
        console.log("Plain password:", password);

        // Debugging: Check the length of passwords to identify whitespace issues
        console.log("Fetched captain password length:", captain.password.length);
        console.log("Plain password length:", password.length);

        // Trim spaces from both the plain password and stored hashed password
        const trimmedPlainPassword = password.trim();
        const trimmedStoredPassword = captain.password.trim();

        // Check if passwords have any leading/trailing whitespace
        console.log("Trimmed Plain Password:", trimmedPlainPassword);
        console.log("Trimmed Stored Password:", trimmedStoredPassword);

        // Compare passwords using bcrypt
        const isMatch = await bcrypt.compare(trimmedPlainPassword, trimmedStoredPassword);
        console.log("bcrypt comparison result:", isMatch);  // Log comparison result

        if (!isMatch) {
            console.log("Invalid credentials: password mismatch");
            return res.status(401).json({ message: "Invalid credentials!" });
        }

        // Generate auth token for the captain
        const token = await captain.generateAuthToken();
        console.log("Generated token:", token);

        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // Set to true in production with HTTPS
            sameSite: "strict",
        });

        res.send({ captain, token });
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ message: "Server error while logging in", error: error.message });
    }
};




const getProfile= async(req,res)=>{
   
     console.log("Request is",req)
     const captain = req.captain;
     console.log(captain)






}


const logoutCaptain = async(req,res)=>{

}
module.exports={registerCaptain,loginCaptain,getProfile,logoutCaptain}