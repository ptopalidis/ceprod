const mongoose = require('mongoose');

//Here we define the User Model


const userSchema = new mongoose.Schema({

    username: {
        type:String,
        required:[true,"The username is required."]
    },
    password: {
        type:String,
        required:[true,"The password is required."]
    },
    isAdmin:{
        type:Boolean
    },
    bussinesName:{
        type:String
    },
    AFM:{
        type:String
    },
    DOI:{
        type:String
    },
    address:{
        type:String
    },
    phone:{
        type:String
    },
    email:{
        type:String
    },
    logo:{
        type:String
    },
    signature:{
        type:String
    },
    subscriptionStart:{
        type:Date
    },
    isLocked:{
        type:Boolean
    }
  
});


module.exports = mongoose.model("User",userSchema, "Users");