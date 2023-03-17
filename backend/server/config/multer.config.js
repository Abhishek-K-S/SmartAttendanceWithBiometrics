const multer = require('multer');

const regPath = 'registration/'
const verPath = 'verification/'

//registration storage
const regStorage = multer.diskStorage({
    destination: function (req, file, next){
        next(null, regPath)
    },
    filename: function (req, file, next){
        next(null, file.originalname)
        //set original file name to the request
        req['filename'] = file.originalname
    }
})

//verificaiton video storage
const verStorage = multer.diskStorage({
    destination: function (req, file, next){
        next(null, verPath)
    },
    filename: function (req, file, next){
        next(null, file.originalname)
        req['filename'] = file.originalname;
    }
})

//create independent storage objects and passs to the index.js
const regUpload = multer({storage: regStorage});
const verUpload = multer({storage: verStorage});

module.exports = { regUpload, verUpload, regPath, verPath }