const {Router} = require('express')

const router = Router()

const Admin = require('./Models/admin')
const Attendance = require('./Models/attendance')
const User = require('./Models/user')

router.post('/admin/login', (req, res) =>{
    try{
        if(!req.body.username || ! req.body.password){
            // console.log(req)
            throw Error('invalid credentials')
        }
        const username = req.body.username
        const password = req.body.password

        Admin.find({username}).then((list)=>{
            if(list.length >0 && list[0].password == password){
                res.status(200).json({message: 'authorised'})
            }
            else{
                res.status(400).json({message: 'invalid credentials'})
            }
        })
        .catch(err=> {throw Error(err)})
    }
    catch(err){
        res.status(401).json({message: err.message});
    }
})

router.get('/admin/users', (req, res) =>{
    User.find().then(list=>{
        res.status(200).json({userlist: list})
    })
})

router.get('/admin/user/:empID', (req, res)=>{
    let empID = req.params.empID
    try{
        if(empID.length == 0){
            throw Error()
        }
        User.find({employeeID: empID}).then((user)=>{
            if(user.length >0){
                userDetails = user[0]
                Attendance.find({employeeID: empID}).then(att=>{
                    res.status(200).json({ ...user.at(0)._doc, attendancelog: [...att]})
            })
            }
    })
    }
    catch(err){
        res.status(400).json({message: "couldn't process the request"});
    }
})

module.exports =  router;