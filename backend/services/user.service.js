const UserModel = require("../db/models/user.model");

module.exports.createUser = async({
    firstname,lastname, emailId,password
    
})=>{
    if(!firstname || !lastname || !emailId || !password)
    {
        throw new Error("All fields are required!");
    }

    const user = await UserModel.create({
      
        
            firstname,
            lastname,
      
        emailId,
        password
    });

    return user;
}