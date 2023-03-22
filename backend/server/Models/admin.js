const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
    username: {
        required: true,
        type: String,
        unique: true
    },
    password: {
        required: true,
        type: String
    }
})

const Admin = mongoose.model('Admin', adminSchema)

module.exports = Admin;