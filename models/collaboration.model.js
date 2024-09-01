const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collaborationSchema = new Schema({
    noteId : {type: Schema.Types.ObjectId, ref: 'Note', required: true},
    senderId : {type: Schema.Types.ObjectId, ref: 'User', required:true},
    receiverId: {type: Schema.Types.ObjectId, ref: 'User', required:true},
    status: {type: String, enum:['pending','accepted','declined'], default:'pending'},
    }, {timestamps:true });


module.exports = mongoose.model('Collaboration', collaborationSchema);