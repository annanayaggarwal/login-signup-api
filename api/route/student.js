const express = require('express');
 const router =express.Router();
const Student = require('../models/student');
const mongoose = require('mongoose');

router.get('/',(req,res,next)=>{
        Student.find()
        .then(result=>{
            res.status(200).json({
                studentdata:result
            });
        }) 
        .catch(err=>{
            console.log(err);
            res.log(500).json({
                error:err
            })
        });
})
router.get('/:id',(req,res,next)=>{
     console.log(req.params.id);
     Student.findById(req.params.id)
     .then(result=>{
        res.status(200).json({
            student:result
        });
    }) 
    .catch(err=>{
        console.log(err);
        res.log(500).json({
            error:err
        })
    });
})
router.post('/',(req,res,next)=>{
    const student =new Student({
        _id:new mongoose.Types.ObjectId,
        name:req.body.name,
        email:req.body.email,      
        gender:req.body.gender,      
        contact:req.body.contact      
    })

    student.save()
    .then(result=>{
        console.log(result)
        res.status(200).json({
            newStudent:result
        })
    })
    .catch(err=>{
        console.log(err),
        res.status(500).json({
            error:err
        })
    })
})
// delete request
router.delete('/:id',(req,res,next)=>{
    Student.remove({_id:req.params.id})
    .then(result=>{
        res.status(200).json({
            message:' data deleted sucessfully',
            result:result
        })
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    })
})

// put request to update any file js
router.put('/:id',(req,res,next)=>{
    Student.findOneAndUpdate({_id:req.params.id},{
        $set:{
        name:req.body.name,
        email:req.body.email,      
        gender:req.body.gender,      
        contact:req.body.contact  
    }
    })
    .then(result=>{
        res.status(200).json({
            message:' data deleted sucessfully',
            updated_detail:result
        })
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    })
})




module.exports = router;