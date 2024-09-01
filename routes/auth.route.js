require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');

const router = express.Router();


// To register new user
router.post('/register', async (req,res) =>{
    try{
        const {username, password} = req.body;

        // if user already exists
        const userExists = await User.findOne({username});
        if(userExists){
           return res.status(400).send({error: 'Username Already Exists'});
        }

        const hashedpassword = await bcrypt.hash(password,10);
        const user = new User({username : username, password: hashedpassword});
        await user.save();
        return res.status(200).send({message : 'Registration Successfull!'});
    
    } catch(error){
        return res.status(400).send({error : 'Registration Failed!'});
    }
});


// Login
router.post('/login', async (req,res) =>{
    try{
        const {username,password} = req.body;
        const user = await User.findOne({username});
        if(!user){
          
           return res.status(400).send({error : 'Invalid Username'});
        }

        const isPasswordCorrect = await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect){
           
           return res.status(400).send({error : 'Incorrect Password'});
        }
       req.session.userId = user._id;
       req.session.username = user.username;
       
      return res.status(200).send({message : 'Login Sucessfull'});
    } catch(error){
        
       return res.status(400).send({error : 'Login Failed. Please try again later.'});
    
    }

});


//Logout
router.post('/logout', (req,res) =>{
    try{
    req.session.destroy(err =>{
        if(err){
            return res.status(500).send({error : 'Logout Failed'});
        }
        return res.status(200).send({message : 'Logout Successfull!'});
    });
   } catch(error){
    return res.status(400).send({error : 'An error occured. Please try again later.'});
   }

});


// To fetch userid 
router.get('/user/details',(req,res) =>{
    try{
    if ( req.session.userId) {
        return res.status(200).send({ userId: req.session.userId });
    } else {
        return res.status(401).send({ error: 'User not logged in' });
    }
 } catch(error){
    return res.status(400).send({error : 'An error occured. Please try again later.'});
   }
});


// Middleware authentication
 const  authMiddleware =  (req,res,next) => {
    try{
   
    if(req.session.userId){
        return next();
        
    }
    res.redirect('/login');
 } catch(error){
    return res.status(400).send({error : 'An error occured. Please try again later.'});
   }

};


module.exports = {
    router,
    authMiddleware,
};