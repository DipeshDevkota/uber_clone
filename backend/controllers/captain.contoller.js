const { validationResult } = require("express-validator");
const CaptainModel = require("../db/models/captain.model")
const captainService = require("../services/captain.service");
const registerUser = async(req,res)=>{
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

        const token = captain.generateAuthToken();
        
        res.status(201).json({
            message:"You have been registered!",
            token,
            captain
        });
        
    } catch (error) {
        console.error("Internal Server Error");
        return res.status(400).json({error:error.message})
        
    }
}

module.exports={registerUser}