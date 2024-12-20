const UserModel = require('../db/models/user.model');
const { createUser } = require('../services/user.service');
const {AuthUser} = require('../middlewares/Authmiddleware')

const registeruser = async (req, res) => {
    try {

        console.log("Request body received",req.body);
      const { firstname, lastname, emailId, password } = req.body;

      const isUserExists = await UserModel.findOne({emailId});
      if(isUserExists)
      {
         return res.status(400).json({message:"User already exists!"})
      }
      const hashedPassword = await UserModel.hashPassword(password);
  
      const user = await createUser({
        firstname,
        lastname,
        emailId,
        password: hashedPassword,
      });
    

      console.log(password);
      console.log(user);
      // const token = await user.generateAuthToken();
  
      return res.status(201).send(user );
    } catch (error) {
      console.error("Error in registeruser:", error.message); // Log the error
      return res.status(500).send({ error: "Internal Server Error" });
    }
  };




const loginuser = async (req,res)=>{
    try {

        const {emailId,password}= req.body;
        if(!emailId || !password)
        {

            return res.status(500).json("All fields are required!")
        }

        const userexists= await UserModel.findOne({emailId}).select('+password')
        if(!userexists)
        {

        return res.status(401).json({message:"Invalid email or password!"})
           }

        const comparePassword= await userexists.comparePassword(password);
        if(!comparePassword)
        {
        return res.status(401).json({message:"Invalid email or password!"})

        }

        const token = await userexists.generateAuthToken();
        console.log("New token generated is",token)
        

        res.cookie("token",token,{
          httpOnly: true,
          sameSite:"strict",
          maxAge: 24 * 60 * 60 * 1000,
        })

   

        res.status(200).json({message:"Login successful!", user:userexists})
        
    } catch (error) {
        console.error("Error in registeruser:", error.message); // Log the error
        return res.status(500).send({ error: "Internal Server Error" });
        
    }
}
  
const logoutUser = async (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()), // Expire the cookie immediately
      httpOnly: true,
    });
    res.status(200).json({ message: "User logged out successfully!" });
  } catch (error) {
    console.error("Error in logoutUser:", error.message);
    res.status(500).json({ message: "Failed to log out. Please try again." });
  }
};

const profileUser = async(req,res)=>{
  try {
    const user = req?.user;
    console.log("Loggedin User is",user);


   res.status(200).send(user)
    
  } catch (error) {
    console.error("Error in logoutUser:", error.message);
    res.status(500).json({ message: "Failed to log out. Please try again." });
  }
};










module.exports={registeruser,loginuser,logoutUser,profileUser}