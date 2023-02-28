const app = require('express')();
const server = require('http').createServer(app);
const cors = require('cors')
const uuid = require('uuid')
require('dotenv').config()


const { regUpload, verUpload } = require("./config/multer.config")
const { trainFace } =  require('./services/ml.service')

require('./config/mongodb.config')()
const User = require('./Models/user');
const Attendance = require('./Models/attendance');

const corsOption = {
    origin: "*",
    credentials: true,
    optionSuccessStatus: 200
} 
app.use(cors(corsOption))

//python script to complete the registration
app.post('/register', regUpload.single('register'), async (req, res) =>{
    const {name, employeeID, latitude, longitude} = req.body
    let filename = req.filename
    try{
        const user = await User.create({name, employeeID, latitude, longitude}).catch(error=>{ throw error });
        let result = trainFace(filename, user._id)
        if(result.code == 200)
            res.status(201).json(result.text)
        else{
            await User.findByIdAndRemove(user._id);
            throw new Error(result.text)
        }
    }
    catch(error){
        res.status(400).json({reason: error.message});
    }
})

app.post('/login', verUpload.single('verify'), async (req, res) =>{
    //verfiy the user
    // let filename = req.filename
    let { employeeID } = req.body;
    const user = await this.findOne({employeeID});
    try {
        if(user){
            //code to match the location perimeter
            //if inside locatin, then put attendance, else throw an error
            if(true){
                let uid = uuid.v4()
                await Attendance.create({employeeID, loginTime: new Date().toString(), uid}).catch(err=> {throw err})
                res.status(200).json('Login successful')
            }
            else{
                throw Error('You are not allowed to login outside the orgainzation location.')
            }
        }else{
            throw Error("User doesn't exists. Register before logging in")
        }
    } catch (error) {
        res.status(400).json({reason: error.message})
    }
})

app.get('/logout', async (req, res) => {
    //check if user with id exists
    const { employeeID, uid } = req.body
    try {
        const user = await Attendance.findOne({employeeID, uid}).catch(err=>{throw err})
        if(user){

        }
        else{

        }
    } catch (error) {
        res.status(400).json({reason: "user not authorized"})
    }
})

server.listen(process.env.PORT, () =>{
    console.log(`server is running at port ${process.env.PORT}`)
})