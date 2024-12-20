const express = require('express');
const router = express.Router();
const {registerCaptain,loginCaptain} = require("../controllers/captain.contoller")



router.post('/register',registerCaptain);
router.post('/login',loginCaptain)




module.exports= router;