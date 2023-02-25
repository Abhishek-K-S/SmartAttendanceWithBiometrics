const multer = require('multer');

const regPath = 'registration/'
const verPath = 'verification/'

const regStorage = multer.diskStorage({
    destination: function (req, file, next){
        next(null, regPath)
    },
    filename: function (req, file, next){
        next(null, file.originalname)
        req['filename'] = file.originalname
    }
})

const verStorage = multer.diskStorage({
    destination: function (req, file, next){
        next(null, verPath)
    },
    filename: function (req, file, next){
        next(null, file.originalname)
        req['filename'] = file.originalname;
    }
})

const regUpload = multer({storage: regStorage});
const verUpload = multer({storage: verStorage});

module.exports = { regUpload, verUpload, regPath, verPath }