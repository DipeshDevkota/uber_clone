const Captain = require("../db/models/captain.model");


module.exports.createModel = async({
  firstname, lastname, email, password, color,plate ,capacity,
  vehicleType

})=>{


    if(!firstname || !lastname || !email || !password || !color || !plate || !capacity || !vehicleType )
    {
        throw new Error("All fields are required!");
    }

    const captain = new Captain({
        fullname:{
            firstname,
            lastname
        },
        
        email,
        password,
        vehicle:{
            color,
            plate,
            capacity,
            vehicleType
        }
    })


    return captain;

    
}