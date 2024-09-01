const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const Collaboration = require('../models/collaboration.model');
const Note = require('../models/notes.model');
const io = require('../public/scripts/socket').getIo();


//Send Collaboration request 
router.post('/request',async (req,res) => {
    const { username} = req.body;
    try{
        const collaborator = await User.findOne({username});
        if(!collaborator){
            return res.status(404).send({error:'User not found'});
        }
        
        const note = new Note({title: " ", content: " ",author:req.session.userId});
        const data = await note.save();
        

        const invite = new  Collaboration({
            noteId: data._id,
            senderId: req.session.userId,
            receiverId: collaborator._id,
            status: 'pending'
        });

        await invite.save();

        //Emit real time notification to the receiver
        io.to(collaborator._id.toString()).emit('collaboration',{
            noteId: data._id,
            senderUsername: req.session.username,
            inviteId: invite._id
        });
        return res.status(200).send({message : 'Invitation sent. Waiting for response...', sessionId: invite._id});
    } catch(error){
        console.error(error);
        return res.status(500).send({error:'Server error'});
    }
});


//Accept collaboration request
router.post('/invites/:inviteId/accept',async (req,res) =>{
    const inviteId = req.params.inviteId;
    try{
        const invite = await Collaboration.findById(inviteId);
        invite.status = 'accepted';
        await invite.save();

         //Emit real time notification to the sender if request is accepted
         io.to(invite.senderId.toString()).emit('accepted',{
            sessionId: invite._id
         }); 

        return res.status(200).send({message : 'Invite accepted', sessionId: invite._id});

    } catch(error) {
        console.error(error);
        return res.status(500).send({error : 'Server error'});
    }
    
});


//Decline collaboration request
router.post('/invites/:inviteId/decline', async (req,res) =>{
    const inviteId = req.params.inviteId;
    try{
        const invite = await Collaboration.findById(inviteId);
        invite.status = 'declined';
        await invite.save();

            //Emit real time notification to the sender if request is declined
            io.to(invite.senderId.toString()).emit('declined'); 

        return res.status(200).send({message : 'Invite declined'});
    } catch(error){
        console.error(error);
        return res.status(500).send({error:'Server error'});
    }
});

//get note_id for a session

router.get('/session/note/:sessionId', async (req,res) =>{
    const sessionId = req.params.sessionId;
    try{
        const invite = await Collaboration.findById(sessionId);
        return res.status(200).send({ noteId: invite.noteId });
    } catch(error)
    {
        return res.status(401).send({ error: 'NoteId not found' });
    }
        
});


module.exports = router;