const mongoose = require('mongoose');
const appointSchema = new mongoose.Schema({
  userId : String,
  doctorId : String,
  doctorName:String,
  pName : String,
  pAge : Number,
  timing : String,
  date : String,
  bookedOn:String,
  status:String,
  isBooked : Boolean},
  { collection : "Appointments"
});
module.exports = mongoose.model('Appointments',appointSchema)