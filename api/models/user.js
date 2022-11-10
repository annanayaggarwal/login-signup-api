const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    username:String,
    email:String,
    password:String,
    contact:Number
})

module.exports = mongoose.model('user',userSchema);