const express = require('express')
const router = express.Router();

//mongodb user model
const User = require('./../models/User')

//mongodb userverification model
const UserVerification = require('./../models/userverification')

// email handler
const nodemailer = require('nodemailer');

const path = require('path')

//unique string
const {v4:uuidv4}  = require('uuid');

//secret file
require("dotenv").config();

//password handler
const bcrypt = require('bcrypt');

//nodemailer transporter
let transporter = nodemailer.createTransport({
    service : "gmail",
    auth:{
        user : process.env.AUTH_EMAIL,
        pass : process.env.AUTH_PASS,
    }
})

transporter.verify((error,success)=>{
    if(error){
        console.log(error);
    }else{
        console.log("ready for messages")
        console.log(success);
    }
})

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
        message:"enter a valid shopname"
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
                message:"User with this mail already exist"
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
                    password:hashedPassword,
                    verified:false,
                })

                NewUser
                .save()
                .then(result=>{
                  sendVerificationEmail(result,res);
                })      
                .catch((err)=>{
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

//send verification email
const sendVerificationEmail=({_id,email},res)=>{
    const currentURL = "https://localhost:5000/"

    const uniqueString = uuidv4()+_id;
    console.log(uniqueString);

    //mail options
    const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to:email,
        subject :"verify your email",
        html:`<p>verify your email to complete the process of signup and login into your account         </p><p>This link <b>expires in 6 hours</b></p><p>Press <a href=${currentURL + "user/verify" + 
        "/" +_id + "/" + uniqueString}>here</a>to proceed.</p>`
    }

    //hash the unique string
    const saltrounds = 10;
    bcrypt
    .hash(uniqueString,saltrounds)
    .then((hashedUniqueString)=>{
        const newVerification = new UserVerification({
            userId: _id,
            uniquestring: hashedUniqueString,
            createdat: Date.now(),
            expiredat: Date.now() + 21600000
        });

        newVerification
        .save() 
        .then(()=>{
            transporter
            .sendMail(mailOptions)
            .then(()=>{
                //email send and verication record saved
                res.json({
                    status:"PENDING",
                    message:"Verification email has been sent"
                })
            })
            .catch((error)=>{
                console.log(error)
                res.json({
                    status:"failed",
                    message:"email verification has failed"
                })
            })
        })
        .catch((error)=>{
            if(error){
                console.log(error);
                res.json({
                    status:"failed",
                    message:"Couldn't save verification email"
                })
            }
        })
    })
    .catch(()=>{
        res.json({
            status:"failed",
            message:"An error ocuured while hashing the email"
        })
    })
}

router.get('/verify/:userId/:uniqueString',(req,res)=>{
    let {userId,uniqueString} = req.params;

    UserVerification
    .find({userId})
    .then((result)=>{
        if(result.length>0){
            const hashedUniqueString = result[0].uniquestring;
            bcrypt
            .compare(uniqueString, hashedUniqueString)
            .then((result)=>{
                if(result){
                    user.updateOne({_id:userId}, {verifed:true})
                    .then(()=>{
                        UserVerification
                        .deleteOne({userId})
                        .then(()=>{
                            res.sendFile(__dirname, "./../views/verified.html")
                        })
                        .catch((error)=>{
                            let message = "An error occured while finalizing successfull verified email "
                            res.redirect(`/user/verified/error=true&message=${message}`)
                            // res.redirect('/users')
                        })
                    })
                    .catch((error)=>{
                        let message = "An error occured while updating user record to verify "
                        res.redirect(`/user/verified/error=true&message=${message}`)
                        // res.redirect('/users')
                    })
                }else{
                     let message = "invalid veris=fication details"
                     res.redirect(`/user/verified/error=true&message=${message}`)
                    // res.redirect('/users')
                }
            })
            .catch((error)=>{
                let message = "An error while comparing new string"
                res.redirect(`/user/verified/error=true&message=${message}`)
                // res.redirect('/users')
            })
        }else{
        let message = "Account record doesn't exist or signed up previously"
        res.redirect(`/user/verified/error=true&message=${message}`)
        // res.redirect('/users')
        }
    })
    .catch((error)=>{
        console.log(error);
        let message = "An error an ocurred while checking for existing user"
        res.redirect(`/user/verified/error=true&message=${message}`)
        // res.redirect('/users')
    })
})

// verifed router page
router.get("/verified",(req,res)=>{
    res.sendFile(path.join(__dirname,"./../views/verified.html"))
})


router.post('/signin',function(req,res){
    let {email, password} = req.body;
    if(email =="" || password ==""){
        res.json({
            status:"failed",
            message:"empty fields"
        })
    }else{
        User.find({email}).then(data=>{
            if(data.length){

                //check if data is verified
                if(!data[0].verified){
                    res.json({
                        status:"FAILED",
                        message:"Email not verified yet",
                    })
                }else{
                    const hashedPassword = data[0].password;
                bcrypt.compare(password,hashedPassword).then(result=>{
                    if(result){
                        res.json({
                            status:"SUCCESS",
                            message:"SignUp successfull",
                            data: result,
                        })
                    }else{
                        res.json({
                            status:"FAILED",
                            message:"Wrong password",
                        })
                    }
                })
                .catch(err=>{
                    res.json({
                        status:"FAILED",
                        message:"error occured while comparing",
                    })
                })
                }
                
            }else{
                res.json({
                    status:"FAILED",
                    message:"invalid credentials",
                })
            }
        })
        .catch(err=>{
            res.json({
                status:"FAILED",
                message:"error occured while checking for existing user",
            })
        })
    }
})

module.exports = router;