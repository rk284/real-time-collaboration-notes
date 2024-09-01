const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NoteSchema = mongoose.Schema({

    title:{
        type: String,
        required: true
    },
    content:{
        type:String,
        required: true
    },
    author:{
        type: Schema.Types.ObjectId,
        ref:'User',
        required: true
    }

}, {timestamps:true});

const Note = mongoose.model('Note',NoteSchema);
module.exports = Note;