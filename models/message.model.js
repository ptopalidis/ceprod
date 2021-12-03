const mongoose = require('mongoose');

//Here we define the User Model


const messageSchema = new mongoose.Schema({

    userID:{
        type:String
    },
    text:{
        type:String
    },
    isRead:{
        type:Boolean
    },
    date:{
        type:Date
    }
  
});


module.exports = mongoose.model("Message",messageSchema, "Messages");