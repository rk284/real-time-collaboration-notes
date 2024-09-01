const socketIo = require('socket.io');

let io;

function init(server){
    try{
    io = socketIo(server);
    

    io.on('connection', (socket) =>{

        // Join user-specific room
        socket.on('join',({userId}) =>{
            socket.join(userId);
        });

        //Handle joining collaboration session
        socket.on('joinSession',({sessionId}) =>{
            socket.join(sessionId);
        });

        //Handle notes updates in collabration session
        socket.on('updateNotes',({data}) =>{
           
            const  sessionId = data.sessionId;
            
            io.to(sessionId).emit('updateNotesDetails',{details: data.details});
           
        });

        //Handle ending collaboration session
        socket.on('endSession',({sessionId}) =>{
            socket.leave(sessionId);
            io.to(sessionId).emit('sessionEnded');
        });
     
       

    });
    
} catch(error){
    console.log(error);
}


}

function getIo(){
    if(!io){
        console.log("Socket.io not initialized!");
    }
    return io;
}


module.exports = {init, getIo};