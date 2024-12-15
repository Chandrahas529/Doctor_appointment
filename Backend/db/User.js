const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name:String,
    email:String,
    mobile:Number,
    gender:String,
    password:String,
    src:String},{collection:'Users'}
);
module.exports = mongoose.model('Users',userSchema);