const express = require('express');
const {registeruser,loginuser,logoutUser,profileUser} = require('../controllers/user.controller');
const {AuthUser} = require("../middlewares/Authmiddleware")
const userroute = express.Router();

userroute.post('/register',registeruser)
userroute.post('/login',loginuser)
userroute.post('/logout',AuthUser,logoutUser)
userroute.get('/profile',AuthUser,profileUser)






module.exports= userroute;