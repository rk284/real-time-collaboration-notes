const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    
        username:{
            type: String,
            required : [true,"Please enter username"],
            unique: true
        },
        password:{
            type: String,
            required : [true,"Please enter password"]
        },
        
    

});

const User = mongoose.model("User",UserSchema);
module.exports = User;