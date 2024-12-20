const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email address');
            }
        }
    },
    password: {
        // select: false, 
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Password is not strong enough");
            }
        }
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
                // required: true // Make required if it's essential for business logic
            },
            lng: {
                type: Number,
                // required: true // Make required if it's essential for business logic
            }
        }
    }
}, {
    timestamps: true
});

// Pre-save hook to hash password before saving it to the DB
captainSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Method to generate authentication token
captainSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY, { expiresIn: '30d' });
    return token;
}

// Static method to verify authentication token
captainSchema.statics.verifyToken = function(token) {
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    return decodedToken;
}

// Static method to hash the password
captainSchema.statics.hashPassword = async function(password) {
    return await bcrypt.hash(password, 10);
};

// Method to compare the plain text password with the hashed password
captainSchema.methods.comparePassword = async function(password) {
    // Compare the plain password with the hashed password
    console.log("Comparing password:", password);  // Log the password argument
    console.log("Stored hashed password:", this.password);
    return await bcrypt.compare(password, this.password);
};

const Captain = mongoose.model('Captain', captainSchema);

module.exports = Captain;
