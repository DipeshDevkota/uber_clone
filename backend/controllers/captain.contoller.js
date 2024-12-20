const { validationResult } = require("express-validator");
const CaptainModel = require("../db/models/captain.model")
const captainService = require("../services/captain.service");
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


const loginCaptain = async(req,res)=>{
    try {
          const errors = validationResult(req);

          if(!errors.isEmpty())
          {
            return res.status(400).json({errors:errors.array()});
          };


          const {email,password} = req.body;
          if(!email || !password)
          {
            return res.status(401).json({message:"All fields are required!"})
          }


          const captain = await CaptainModel.findOne({email}).select('+password');

          if(!captain)
          {
            return res.status(401).json({message:"Captain doesn't exist!"})
          };

          const isMatch= await captain.comparePassword(password);

          if(!isMatch)
          {
            return res.status(401).json({message:"You are not authenticated!!"});
          }

          const token = captain.generateAuthToken();

          res.cookie("token",token,{
            httpOnly: true,
            secure:false,
            sameSite:"strict",
          });


          res.send({captain,token});
        
    } catch (error) {

        return res.status(500).json({message:"Server error while logging in",error:error.message})
        
    }
};


module.exports={registerCaptain,loginCaptain}