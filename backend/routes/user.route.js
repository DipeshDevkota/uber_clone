const express = require('express');
const {registeruser} = require('../controllers/user.controller');
const userroute = express.Router();

userroute.post('/register',registeruser)



module.exports= userroute;