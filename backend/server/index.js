const app = require('express')();
const server = require('http').createServer(app);
const cors = require('cors')
require('dotenv').config()


const { regUpload, verUpload } = require("./config/multer.config")
const { trainFace } =  require('./services/ml.service')

const corsOption = {
    origin: "*",
    credentials: true,
    optionSuccessStatus: 200
} 

app.use(cors(corsOption))

//python script to complete the registration
app.post('/register', regUpload.single('register'), async (req, res) =>{
    let filename = req.filename
    let result = trainFace(filename)
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