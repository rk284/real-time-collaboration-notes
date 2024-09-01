require('dotenv').config();
const express = require('express');
const router = express.Router();
const Note = require('../models/notes.model');
const auth= require('../routes/auth.route')


// Create a note in DB
router.post('/create/notes',auth.authMiddleware, async (req,res) =>{
  try{

   const {title,content} = req.body;
   const note = new Note({title : title, content : content, author: req.session.userId});
   await note.save();
   return res.status(200).send({message:'Note has been saved successfully'});

  } catch(error){
    console.error('Error:',error);
    return res.status(400).send({error:'Failed! Please try again later.'});
  }


});


//Fetch all notes for a user
router.get('/view/notes', auth.authMiddleware, async (req,res) =>{

    try{
    const notes = await Note.find({'author':req.session.userId});
    return res.status(201).json({notes: notes});
    } catch(error){
        return res.status(404).send({error:'No Notes has been created yet!'});
    }

});


//To update a note
router.put('/update/:id', auth.authMiddleware, async (req,res) =>{

    try{
        const note = await Note.findByIdAndUpdate(req.params.id, req.body);
        if(!note){
            return res.status(404).send({error:'Notes not found'});
        }
        return res.status(200).send({message:'Notes has been updated!'});
    } catch(error){
        console.log(error);
        return res.status(400).send({error:'Failed. Please try again later'});
    }
})


//To delete a note
router.delete('/delete/:id',auth.authMiddleware, async (req,res) =>{

    try{
        const note = await Note.findByIdAndDelete(req.params.id);
        if(!note){
            return res.status(404).send({error:'Notes not found'});
        }
        return res.status(200).send({message:'Notes has been deleted sucessfully'});
    } catch(error){
        return res.status(400).send({error:'Failed. Please try again later'});
    }
});


module.exports = router;