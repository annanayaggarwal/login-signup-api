require('dotenv').config()
const mongoose = require('mongoose')


mongoose.set('strictQuery', false)
mongoose.connect("mongodb+srv://annanay:annanay2003@cluster0.yirlyse.mongodb.net/?retryWrites=true&w=majority",{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(()=>{
    console.log("db connected")
})
.catch((err)=> console.log(err));


