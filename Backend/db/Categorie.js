const mongoose = require('mongoose');
const CategSchema = new mongoose.Schema({
    categorie:String,
    doctors:Number
},{collection:'Categories'});
module.exports = mongoose.model('Categories',CategSchema)
