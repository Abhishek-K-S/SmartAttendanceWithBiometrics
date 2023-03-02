const app = require('express')();
const server = require('http').createServer(app);
const cors = require('cors')
const uuid = require('uuid')
const fs = require('fs');
const path = require('path')
require('dotenv').config()


const { regUpload, verUpload } = require("./config/multer.config")
const { trainFace, verifyFace } =  require('./services/ml.service')
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

//register the user and train a model from the given video
app.post('/register', regUpload.single('register'), async (req, res) =>{
    const {name, employeeID, latitude, longitude} = req.body
    let filename = req.filename
    try{
        //create a new user in the db, we do create the entry first as we need id for the processing of video sent by the user
        const user = await User.create({name, employeeID, latitude, longitude}).catch(error=>{ throw error });
        let result = trainFace(filename, user._id)
        if(result.code == 200){
            //model is created
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
    fs.rm(path.join(__dirname, "registration", filename), (err)=>{}) //remove video file from the system.
})

app.post('/login', verUpload.single('verify'), async (req, res) =>{
    //verfiy the user
    let { employeeID, latitude, longitude } = req.body;
    const filename = req['filename']
    try {
        //check if user already logged in using employee id
        const user = await this.findOne({employeeID});
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
                await Attendance.create({employeeID, loginTime: new Date().toString(), uid}).catch(err=> {throw err})
                //try to put uid in cookies and fetch the same later
                res.status(200).json({message: 'Login successful', uid})
            }
            else{
                throw Error('You are not allowed to login outside the orgainzation location.')
            }
        }else{
            throw Error("User doesn't exists. Register before logging in")
        }
    } catch (error) {
        //Cahnge the error message if its from the db
        if(error.code == 11000)
            error.message = "Invalid user creadentials."
        res.status(400).json({message: error.message})
    }
    fs.rm(path.join(__dirname, "verification", filename), (err) =>{})
})

//get the list of user attendance
app.get('/attendance', async (req, res) =>{
    const { employeeID, uid } = req.body
    try{
        //get current user, if logged in but not logged out
        const attendance = await Attendance.findOne({employeeID, uid}).catch(err=>{throw err})
        if(attendance && !attendance.logoutTime ){
            //if user logged in, then get the list
            const attList = await Attendance.find({employeeID}).catch(err =>{ throw err})
            let attendanceList = [];
            //send only reuqired information to the front end
            for(let a in attList){
                attendanceList.push({id: a.uid, login: a.loginTime, logout: a.logoutTime })
            }
            res.status(200).json(attendanceList);
        }
    } catch(err){
        res.status(400).json({message: "Couldn't fetch attendance list"})
    }
})

app.get('/logout', async (req, res) => {
    //check if user with id exists
    const { employeeID, uid } = req.body
    try {
        //check if user is logged in and not logged out yet
        const attendance = await Attendance.findOne({employeeID, uid}).catch(err=>{throw err})
        if(attendance && !attendance.logoutTime){
            //update the logout time
            await Attendance.updateOne({_id: attendance._id}, {logoutTime: new Date().toString()}).catch(err =>{
                throw Error(err)
            })
            res.status(200).json({message: "Successfully loged out"})
        }
        else{
            throw Error("User not authorized")
        }
    } catch (error) {
        res.status(400).json({message: "User not authorized"})
    }
})

server.listen(process.env.PORT, () =>{
    console.log(`server is running at port ${process.env.PORT}`)
})