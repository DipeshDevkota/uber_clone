const UserModel = require('../db/models/user.model');
const { createUser } = require('../services/user.service');

const registeruser = async (req, res) => {
    try {

        console.log("Request body received",req.body);
      const { firstname, lastname, emailId, password } = req.body;
      const hashedPassword = await UserModel.hashPassword(password);
  
      const user = await createUser({
        firstname,
        lastname,
        emailId,
        password: hashedPassword,
      });
    

      console.log(password);
      console.log(user);
      const token = await user.generateAuthToken();
  
      return res.status(201).send({ token, user });
    } catch (error) {
      console.error("Error in registeruser:", error.message); // Log the error
      return res.status(500).send({ error: "Internal Server Error" });
    }
  };
  



module.exports={registeruser}