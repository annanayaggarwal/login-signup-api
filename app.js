const express = require('express');
const app= express();
const studentRoute = require('./api/route/student');
const userRoute = require('./api/route/user');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


mongoose.connect('mongodb+srv://annany_aggarwal:annanayagg@sbs.ces4ewj.mongodb.net/?retryWrites=true&w=majority');

mongoose.connection.on('error',err=>{
    console.log('connection failed');
    console.log(err);
});

mongoose.connection.on('connected',connected=>{
    console.log('connected with database');

});
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use('/student',studentRoute);
app.use('/user',userRoute);


app.use((req,res,next)=>{
    res.status(404).json({
          error:'bad request'  
    })
})

module.exports = app;