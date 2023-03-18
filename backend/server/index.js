const app = require('express')();
const server = require('http').createServer(app);
const cors = require('cors')
const uuid = require('uuid')
const fs = require('fs');
const path = require('path')
const bodyParser = require('body-parser')
require('dotenv').config()


const { regUpload, verUpload } = require("./config/multer.config")
// const { trainFace, verifyFace } =  require('./services/ml.service')
const { trainFace, verifyFace } = require('./services/mlcnn.service');
const { insidePrimeter } = require('./services/mapDistance.service')

require('./config/mongodb.config')()
const User = require('./Models/user');
const Attendance = require('./Models/attendance');

//cors to enable anybody to make a request
const corsOption = {
    origin: "*",
    credentials: true,
    optionSuccessStatus: 200
} 
app.use(cors(corsOption))
app.use(bodyParser.json())

//register the user and train a model from the given video
app.post('/register', regUpload.single('register'), async (req, res) =>{
    let filename = req.filename
    try{
        // console.log(req.body)
        if(!req.body.employeeID || !req.body.name || !req.body.longitude || !req.body.latitude){
            throw Error('Action not authorized')
        }
        const {name, employeeID, latitude, longitude} = req.body
        console.log(name, typeof(name))
        console.log(employeeID, typeof(employeeID))
        console.log(latitude, typeof(latitude))
        console.log(longitude, typeof(longitude))
        if(isNaN(latitude) || isNaN(longitude)){
            throw Error('Invalid location')
        }
        
        //create a new user in the db, we do create the entry first as we need id for the processing of video sent by the user
        const user = await User.create({name, employeeID, latitude:Number(latitude),longitude: Number(longitude)}).catch(error=>{ throw error });
        let result = trainFace(filename, user._id)
        if(result.code == 200){
            //model is created
            console.log("user registerd with id"+ user._id + " name: "+name)
            res.status(201).json({message: result.text})
        }
        else{
            //in case of error, which implies, user not regiserd properly, so we remove the user entry from teh database
            await User.findByIdAndRemove(user._id);
            throw new Error(result.text)
        }
    }
    catch(error){
        //code 11000 thrown by db, change the default message which shows db heirarchy, write some general message
        if(error.code == 11000)
            error.message = "User already registered. Please login to proceed"
        res.status(400).json({message: error.message});
    }
    // fs.rm(path.join(__dirname, "registration", filename), (err)=>{}) //remove video file from the system.
})

app.post('/login', verUpload.single('verify'), async (req, res) =>{
    const filename = req['filename']
    //verfiy the user
    console.log('tryingto login')
    try {
        if(!req.body.employeeID || !req.body.latitude || !req.body.longitude){
            throw Error('User not authorized')
        }
        const { employeeID, latitude, longitude } = req.body;
        if(isNaN(latitude) || isNaN(longitude)){
            throw Error('Invalid location')
        }
        //check if user already registered in using employee id
        const user = await User.findOne({employeeID});
        if(user){
            //code to match the location perimeter
            //if inside locatin, then put attendance, else throw an error
            if(insidePrimeter(user.latitude, user.longitude, latitude, longitude)){
                //do facial recognition over here
                if(!verifyFace(filename, user._id)){
                    //user face not recognized
                    throw Error("Couldn't verify, Please try again")
                }
                //generate a uid randomly, store a copy in db for later to verify, and send 1 copy to user to send it when logout to verify
                let uid = uuid.v4()
                //create attendance
                await Attendance.create({employeeID, uid}).catch(err=> {throw err})
                // await Attendance.markAttendance(employeeID, uid).catch(err => {throw err});
                //try to put uid in cookies and fetch the same later
                res.status(200).json({message: 'Login successful', uid, name: user.name, employeeID: user.employeeID})
            }
            else{
                throw Error('You are not allowed to login outside the orgainzation location.')
            }
        }else{
            throw Error("User doesn't exists. Register before logging in")
        }
    } catch (error) {
        console.log(error.message)
        //Cahnge the error message if its from the db
        if(error.code == 11000)
            error.message = "Invalid user creadentials."
        res.status(400).json({message: error.message})
    }
    fs.rm(path.join(__dirname, "verification", filename), (err) =>{})
})

//get the list of user attendance
app.post('/attendance', async (req, res) =>{
    console.log('request to attendance')
    try{
        if(!req.body.employeeID || ! req.body.uid){
            throw Error()
        }
        const { employeeID, uid } = req.body
        //check if hte user is valid or not, if not exit the request
        const user = User.findOne({employeeID}).catch(err=>{ throw err })
        if(!user){
            throw Error()
        }
        //get current user, if logged in but not logged out
        const attendance = await Attendance.findOne({employeeID, uid}).catch(err=>{throw err})
        if(attendance && attendance.createdAt.toISOString() === attendance.updatedAt.toISOString() ){
            //if user logged in, then get the list
            const attList = await Attendance.find({employeeID}).catch(err =>{ throw err})
            let attendanceList = [];
            //send only reuqired information to the front end
            for(let a of attList){
                attendanceList.push({login: a.createdAt, logout: a.updatedAt})
            }
            res.status(200).json({attendanceList, accountCreatedOn: user.createdAt});
        }
    } catch(err){
        console.log(err)
        res.status(401).json({message: "Couldn't fetch attendance list"})
    }
})

app.post('/logout', async (req, res) => {
    //check if user with id exists
    try {
        if(!req.body.employeeID || ! req.body.uid){
            throw Error("emp id and uid is not avaialable")
        }
        const { employeeID, uid } = req.body
        
        //check if user is logged in and not logged out yet
        const attendance = await Attendance.findOne({employeeID, uid}).catch(err=>{throw err})
        if(attendance && attendance.createdAt.toISOString()===attendance.updatedAt.toISOString()){
            //update the logout time
            await Attendance.updateOne({_id: attendance._id}, {uid: "undefined"}).catch(err =>{
                throw Error(err)
            })
            console.log("user logging out " + attendance.employeeID)
            res.status(200).json({message: "Successfully loged out"})
        }
        else{
            throw Error("User not authorized")
        }
    } catch (error) {
        res.status(401).json({message: "User not authorized"})
    }
})

server.listen(process.env.PORT, () =>{
    console.log(`server is running at port ${process.env.PORT}`)
})