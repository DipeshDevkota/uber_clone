const dotenv = require('dotenv');
dotenv.config();


const express = require('express');
const cors = require('cors');
const connectDB = require('./db/db.js');

const userroute = require('./routes/user.route')
connectDB()
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use('/',userroute)

app.get('/',(req,res)=>{
    res.send('Hello world');
});


module.exports= app;


