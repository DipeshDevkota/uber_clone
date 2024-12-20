const express = require('express');
const router = express.Router();
const {registerCaptain,loginCaptain,logoutCaptain,getProfile} = require("../controllers/captain.contoller")
const {AuthCaptain} = require("../middlewares/Authmiddleware")

router.post('/register',registerCaptain);
router.post('/login',loginCaptain );
router.get('/profile',AuthCaptain,getProfile);
router.post('/logout',logoutCaptain)




module.exports= router;