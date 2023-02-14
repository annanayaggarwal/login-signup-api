const express = require('express')
const router = express.Router();

//mongodb user model
const User = require('./../models/User')

//password handler
const bcrypt = require('bcrypt');

router.post('/signup',(req,res) =>{
    let {name,shopname, contact, email, password} = req.body;
    // name = name.trim();
    // shopname = shopname.trim();
    // contact = contact.trim();
    // email = email.trim();
    // password = password.trim();


if(name =="" || shopname == "" || contact == "" || email =="" || password ==""){
    res.json({
        status:"failed",
        message:"empty fields"
    })
}else if(!/^[a-zA-Z]*$/.test(shopname)){
    res.json({
        status:"failed",
        message:"enter a valid name"
    })
}else if(!/^[a-zA-Z]*$/.test(name)){
    res.json({
        status:"failed",
        message:"enter a valid name"
    })
// }else if(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)){
//     res.json({
//         status:"failed",
//         message:"enter a valid email"
//     })
}else if(password.length<8){
      res.json({
        status:"failed",
        message:"password must be greater than 8 characters"
    })
}else{
    User.find({email}).then(result=>{
        if(result.length){
            //if user alresdy exists
            res.json({
                status:"failed",
                message:"User with this mail alresdy exist"
            })
        }else{
            //try to create new user
            const saltrounds = 10;
            bcrypt.hash(password,saltrounds).then(hashedPassword =>{
                const NewUser = new User({
                    shopname,
                    contact,
                    name,
                    email,
                    password:hashedPassword
                })

                NewUser.save().then(result=>{
                    res.json({
                        status:"SUCCESS",
                        message:"SignUp successfull",
                        data: result,
                    })
                })
                .catch(err=>{
                    res.json({
                        status:"failed",
                        message:"error occured while creating the user"
                    })
                })
            })

        }
    }).catch(err=>{
        console.log(err)
        res.json({
            status:"failed",
            message:"error occured while checking for existing user"
        })
    })
}
})


router.post('/signin',function(req,res){
    
})

module.exports = router;