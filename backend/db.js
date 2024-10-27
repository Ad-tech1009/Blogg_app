const mongoose = require('mongoose')
require('dotenv').config()

const dataBase=mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("Database is connected successfully !")
}).catch((err)=>{
    console.log(`error is ${err}`)
})

