const express = require('express');
const router = express.Router();
const {registerUser} = require("../controllers/captain.contoller")



router.post('/register',registerUser)



module.exports= router;