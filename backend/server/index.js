const app = require('express')();
const server = require('http').createServer(app);
const cors = require('cors')
const {spawn} = require('child_process')
const fs = require('fs');
const os = require('os')
require('dotenv').config()


const { regUpload, verUpload } = require("./config/multer.config")
const { detectFace } =  require('./services/ml.service')

const corsOption = {
    origin: "*",
    credentials: true,
    optionSuccessStatus: 200
} 

app.use(cors(corsOption))

app.post('/register', regUpload.single('register'), async (req, res) =>{
    //python script to complete the registration
    let filename = req.filename
    let result = detectFace(filename)
    
    res.statusCode = result['code']
    res.json({text: result['text']})
})

app.post('/verify', verUpload.single('verify'), (req, res) =>{
    //verfiy the user
    let filename = req.filename
})

server.listen(process.env.PORT, () =>{
    console.log(`server is running at port ${process.env.PORT}`)
})