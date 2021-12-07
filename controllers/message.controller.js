const messageModel = require("../models/message.model")



exports.createMessage = async(req,res)=>{

    try{
        await messageModel.create(req.body.message);
        res.status(200).send({success:"The messamge was sent!"})
    }
    catch(error){
        console.log(error)
        res.status(400).send({error:"Something went wrong."});
        return;
    }
}

exports.getUserMessages = async(req,res)=>{


    try{
        var messages = await messageModel.find({userID:req.params.userID});
        res.status(200).send({success:"The messages were found.",data:{messages:messages}});
        return;

    }
    catch(error){
        console.log(error)
        res.status(400).send({error:"Something went wrong."});
        return;
    }
}


exports.getUserUnreadMessagesCount = async(req,res)=>{
    console.log(req.params.userID)
    try{
        var count = await messageModel.countDocuments({userID:req.params.userID,isRead:false});
        console.log(count)
        res.status(200).send({success:"The messages were found.",data:{count:count}});
        return;

    }
    catch(error){
        console.log(error)
        res.status(400).send({error:"Something went wrong."});
        return;
    }
}


exports.markMessageAsRead = async(req,res)=>{
    console.log(req.params.messageID)
    try{
        await messageModel.updateOne({_id:req.params.messageID},{isRead:true});

        res.status(200).send({success:"The message was read successfully."});
        return;

    }
    catch(error){
        console.log(error)
        res.status(400).send({error:"Something went wrong."});
        return;
    }
}