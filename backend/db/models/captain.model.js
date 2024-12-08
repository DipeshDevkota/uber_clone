const mongoose = require('mongoose');

const captainSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minlength: [3, 'Firstname must be at least 3 characters long']
        },
        lastname: {
            type: String,
            required: true,
            minlength: [3, 'Lastname must be at least 3 characters long']
        }
    },
    email: {
        type: String,
        required: true,
        unique: true ,
    password: {
        type: String,
        required: true // Removed unique; unique constraint typically applies to identifiers like email
    },
    socketId: {
        type: String,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    vehicle: {
        color: {
            type: String,
            required: true,
            minlength: [3, 'Color must be at least 3 characters long']
        },
        plate: {
            type: String,
            required: true,
            minlength: [3, 'Plate must be at least 3 characters long']
        },
        capacity: {
            type: Number,
            required: true,
            min: [1, 'Capacity must be at least 1'] // Corrected to `min` for numeric validation
        },
        vehicleType: {
            type: String,
            required: true,
            enum: ['car', 'motorcycle', 'auto']
        },
        location: {
            lat: {
                type: Number,
                required: true // Make required if it's essential for business logic
            },
            lng: {
                type: Number,
                required: true // Make required if it's essential for business logic
            }
        }
    }
}}, {
    timestamps: true
});



captainSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id:this._id}, process.env.SECRET_KEY,{ expiresIn: '30d'})
    return token;   
}


captainSchema.statics.verifyToken = function(token){
    const decodedtoken = jwt.verify(token,process.env.SECRET_KEY);
    return decodedtoken;
}


captainSchema.statics.hashPassword = async function(password){
    return await bcrypt.hash(password,10)
};


captainSchema.methods.comparePassword= async function(password){
    return await bcrypt.compare(password,this.password)

}


const Captain = mongoose.model('Captain', captainSchema);



module.exports = Captain;
