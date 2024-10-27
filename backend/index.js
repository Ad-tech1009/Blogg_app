const express = require('express')
const app = express()
const PORT = 8000
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
require('dotenv').config()
require('./db')
const authRoutes = require('./Routes/Auth')
const blogRoutes = require('./Routes/Blog')
const UserSchema = require('./Models/UserSchema')
const BlogSchema = require('./Models/BlogSchema')

app.use(cors())
app.use(bodyParser.json())
app.use(cookieParser())
app.use('/auth',authRoutes)
app.use('/blog',blogRoutes)

app.get('/',(req,res)=>{
    res.send("App is up !!")
})

app.get('/blogCategories',async(req,res)=>{
    const categories = [
        "Technology",
        "Science",
        "Health",
        "Sports",
        "Entertainment",
        "Politics",
        "Business",
        "Education",
        "Travel",
        "Fashion"
    ]
    res.json(categories);
}); 

app.listen(PORT,()=>{
    console.log(`server is running at port ${PORT}`)
})