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
        if(result.code == 200){
            console.log(String(user._id));
            res.status(201).json({message: result.text})
            fs.rmdir(path.join(__dirname, "ml", "image", String(user._id)), { recursive: true, force: true }, (err)=>{}) //remove images folder with frame photos
            fs.rm(path.join(__dirname, "registration", filename), (err)=>{}) //remove video file from the system.
        }
        else{
            await User.findByIdAndRemove(user._id);
            throw new Error(result.text)
        }
    }
    catch(error){
        console.log(error);
        res.status(400).json({message: error.message});
    }
})

app.post('/login', verUpload.single('verify'), async (req, res) =>{
    //verfiy the user
    // let filename = req.filename
    let { employeeID, latitude, longitude } = req.body;
    const user = await this.findOne({employeeID});
    const filename = req['filename']
    try {
        if(user){
            //code to match the location perimeter
            //if inside locatin, then put attendance, else throw an error
            if(insidePrimeter(user.latitude, user.longitude, latitude, longitude)){
                //put face recognition over here
                if(!verifyFace(filename, user._id)){
                    throw Error("Couldn't verify, Please try again")
                }
                let uid = uuid.v4()
                await Attendance.create({employeeID, loginTime: new Date().toString(), uid}).catch(err=> {throw err})
                res.status(200).json({message: 'Login successful', uid})
            }
            else{
                throw Error('You are not allowed to login outside the orgainzation location.')
            }
        }else{
            throw Error("User doesn't exists. Register before logging in")
        }
    } catch (error) {
        res.status(400).json({message: error.message})
    }
    fs.rm(path.join(__dirname, "verification", filename), (err) =>{})
})

app.get('/attendance', async (req, res) =>{
    const { employeeID, uid } = req.body
    try{
        const attendance = await Attendance.findOne({employeeID, uid}).catch(err=>{throw err})
        if(attendance && !attendance.logoutTime ){
            const attList = await Attendance.find({employeeID}).catch(err =>{ throw err})
            let attendanceList = [];
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
        const attendance = await Attendance.findOne({employeeID, uid}).catch(err=>{throw err})
        if(attendance && !attendance.logoutTime){
            await Attendance.updateOne({_id: attendance._id}, {logoutTime: new Date().toString()}).catch(err =>{
                throw Error(err)
            })
            res.status(200).json({message: "Successfully loged out"})
        }
        else{
            throw Error()
        }
    } catch (error) {
        res.status(400).json({message: "User not authorized"})
    }
})

server.listen(process.env.PORT, () =>{
    console.log(`server is running at port ${process.env.PORT}`)
})