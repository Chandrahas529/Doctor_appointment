const mongoose= require('mongoose');
const doctorSchema = new mongoose.Schema({
  name: String,
  experience:  String,
  speciallistof: String,
  qualification: String,
  about:String,
  mobile: String,
  src: String
},{collection:'Doctors list'});
module.exports = mongoose.model('Doctors list',doctorSchema);