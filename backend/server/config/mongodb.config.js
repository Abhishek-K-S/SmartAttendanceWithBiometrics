const mongo = require('mongoose');

const mongoConnect = () =>{
    mongo.connect(process.env.MONGO_URL + '/'+ process.env.DB_NAME, { useNewUrlParser: true , useUnifiedTopology: true } ).then( db =>{
        console.log("connection established")
    }).catch(err =>{
        console.log("error occured",err)
    })
}

module.exports = mongoConnect