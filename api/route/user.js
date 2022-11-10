const express = require('express');
 const router =express.Router();
const Student = require('../models/student');
const user = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
 
router.post('/signup',(req,res,next)=>{
    bcrypt.hash(req.body.password,10,(err,hash)=>{
        if(err){
            return res.status(500).json({
                error:err
            })
        }
        else{
            const user =new User({
                _id:new mongoose.Types.ObjectId,
                username:req.body.username,
                email:req.body.email,      
                password:hash,      
                contact:req.body.contact
            })

            user.save()
            .then(result=>{
                res.status(200).json({
                    new_user:result
                })
            })
            .catch(err=>{
                console.log(err),
                res.status(500).json({
                    error:err
                })
            })
        }
    })
})
router.post('/login',(req,res,next)=>{
    User.find({username:req.bady.username})
    .exec()
    .then(user=>{
        if(user.length < 1){
            return res.status(401).json({
                message:'user not exist'
            })
        }
        bcrypt.compare(req.body.password,user[0].password,(err,result)=>{
            if(!result){
                return res.status(401).json({
                    msg:'password incorrect'
                })
            }
            if(result){
                const token = jwt.sign({
                    username:user[0].username,
                    email:user[0].email,
                    contact:user[0].contact
                },
                'this is dummy text',
                {
                    expiresIn:"24h"
                }
                );
                res.status(200).json({
                    username:user[0].username,
                    email:user[0].email,
                    contact:user[0].contact,
                    token:token
                })
            }
        })
    })
    .catch(err=>{
        res.status(500).json({
            err:err
        })
    })
})







module.exports = router;