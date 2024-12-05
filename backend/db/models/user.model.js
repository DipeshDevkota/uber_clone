const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
    },

    lastname: {
      type: String,
    },

    emailId: {
      type: String,
      isLowercase: true,
      trim: true,
      unique: true,
      required: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address", value);
        }
      },
    },

    password: {
      type: String,
      required: true,

      select: false, //bydefault it will not be available that password

      validate(value) {
        if (!validator.isStrongPassword) {
          throw new Error("Is not a strong password", value);
        }
      },
    },

    age: {
      type: Number,
      min: 18,
    },

    socketId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY, {
    expiresIn: "30d",
  });
  return token;
};


userSchema.methods.verifyToken =  function(token){
    const decoded=  jwt.verify(token,process.env.SECRET_KEY);
    return decoded;
}
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};



const User = mongoose.model("User", userSchema);

module.exports = User;
