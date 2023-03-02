const mongoose = require('mongoose')

const attendanceSchema = new mongoose.Schema({
    employeeID: {
        required: true,
        type: String
    },
    loginTime: {
        required: true,
        type: String
    },
    logoutTime: String,
    uid: {
        required: true,
        type: String
    }
})

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;