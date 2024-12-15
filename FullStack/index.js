const express = require('express');
const app = express();
const { ObjectId } = require('mongodb');
const cors = require('cors');
require('./db/config');
const User = require("./db/User");
const Appointments = require("./db/Appointment")
const Doctors = require("./db/Doctor")
const Categorie = require('./db/Categorie');
const multer = require('multer');
app.use(express.json())
app.use(cors());
app.post('/register',async (req,res)=>{
    let user = new User(req.body);
    let result = await user.save();
    result = result.toObject();
    delete result.password;
    res.send(result);
})
app.post('/login',async (req,res)=>{
    if(req.body.email && req.body.password){
        let user = await User.findOne(req.body).select("-password")
        if(user)
            res.send(user);
        else
            res.send("No result found");
    }else{
        res.send("No result found");
    }    
})
app.post('/appointment',async (req,res)=>{
    let appoint = new Appointments(req.body);
    let result = await appoint.save();
    res.send(result);
})
app.get('/appoints/:id',async (req,res)=>{
    let result = await Appointments.find({'userId':req.params.id})
    res.send(result);
})
app.get('/user/:id',async (req,res)=>{
    let result = await User.findOne({"_id":new ObjectId(req.params.id)})
    res.send(result);
})
app.put('/appointstatus/:id',async (req,res)=>{
    console.log(req.params.id)
    let result = await Appointments.updateOne({"_id":new ObjectId(req.params.id)},{
        $set:{status:"Canceled",isBooked:false}})
    res.send(result);
})
app.put('/updateuser/:id',async (req,res)=>{
    let result = await User.updateOne({"_id":new ObjectId(req.params.id)},
        {$set:req.body}
    )
    res.send(result);
})
app.put('/userpassword/:id',async (req,res)=>{
    let result = await User.updateOne({"_id":new ObjectId(req.params.id)},
        {$set:req.body}
    )
    res.send(result);
})
app.get('/doctorlist',async (req,res)=>{
    let result = await Doctors.find();
    res.send(result);
})
app.get('/categorie',async(req,res)=>{
    let result = await Categorie.find();
    res.send(result);
})
app.get('/doctordetails/:id',async(req,res)=>{
    let result = await Doctors.findOne({'_id':new ObjectId(req.params.id)})
    res.send(result);
})
app.post('/slots',async (req,res)=>{
    let result = await Appointments.find(req.body);
    res.send(result);
})
const upload = multer({
    storage:multer.diskStorage({
        destination:function (req,file,cb){
            cb(null,"./Frontend/src/userimages");
        },
        filename:function (req,file,cb){
            cb(null,file.originalname)
        }
    })
}).single('src');
app.post('/updateimg/:id',upload,async(req,res)=>{
    let result = await User.updateOne({"_id":new ObjectId(req.params.id)},
        {$set:{src:req.file.originalname}})
    res.send(result)
})
app.listen(5000);