const app = require('express')();
const server = require('http').createServer(app);
const cors = require('cors')
const multer = require('multer');
const fs = require('fs');
const os = require('os')
require('dotenv').config()

const { regUpload, verUpload } = require("./config/multer.config")

const corsOption = {
    origin: "*",
    credentials: true,
    optionSuccessStatus: 200
} 

app.use(cors(corsOption))

app.post('/register', regUpload.single('register'), (req, res) =>{
    //python script to complete the registration
    let filename = req.filename
    console.log(req.body, filename)
})

app.post('/verify', verUpload.single('verify'), (req, res) =>{
    //verfiy the user
    let filename = req.filename
})

server.listen(process.env.PORT, () =>{
    console.log(`server is running at port ${process.env.PORT}`)
})