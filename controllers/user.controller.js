const userModel = require("../models/user.model");
const machineModel = require("../models/machine.model")
const path = require("path")
const fs = require("fs")

//Services

const UserFolderService = require("../services/userFolderService");



exports.getAllUsers = async(req,res)=>{

    console.log("asdd")
    try{
        var users = await userModel.find();
        res.status(200).send({success:"Users retreived successfully",data:{users:users}})
    }
    catch(error){
        console.log(error)
        res.status(400).send({error:"Something went wrong."})
        return;
    }

}


exports.authenticateUser = async(req,res)=>{
    
    var user = await userModel.findOne({username:req.body.username});
    console.log(req.body)
    if(!user){
        res.status(400).send({error:"Wrong username"});
        return
    }
    
    if(user.password!=req.body.password){
        res.status(401).send({error:"Wrong password"});
        return
    }

    res.status(200).send({success:"Successfull authentication.",data:{user:user,userID:user._id}})
}

exports.getUserMachines = async(req,res)=>{
    console.log(req.params)
    var machines = await machineModel.find({userID:req.params.userID});

    res.status(200).send({data:{machines:machines}})
}

exports.getUserByID = async(req,res)=>{
    var userID = req.params.userID;

    try{
        var user = await userModel.findOne({_id:userID})
    }
    catch(error){
        res.status(400).send({error:"There was an error"});
        return;
    }

    if(user){
        res.status(200).send({success:"O χρήστης βρέθηκε",data:{user:user}});
    }
}


exports.updateUser = async(req,res)=>{
    var user = JSON.parse(req.body.user);
    console.log(user._id)


    //Manage user filesystem
    var userFolderService = new UserFolderService(user._id);
    var fsRes = userFolderService.createUserFilesystem();
    if(fsRes.error){
        res.status(400).send({error:fsRes.error})
        return
    }


    //Manage req images
    var logo = req.files?req.files.logo:null;
    var signature = req.files?req.files.signature:null;

    if(logo){

        logo.mv(userFolderService.userAccountFolder + "/" + logo.name);
        user.logo = process.env.FILE_PATH +  "/"  + user._id + "/account" + "/" + logo.name;
    }

    if(signature){

        signature.mv(userFolderService.userAccountFolder + "/" + signature.name);
        user.signature = process.env.FILE_PATH +  "/"  + user._id + "/account" + "/" + signature.name;
    }

    try{
        await userModel.updateOne({_id:req.params.userID},user);
    }
    catch(error){
        res.status(400).send({error:"Something went wrong."})
        return;
    }


   

   
    res.status(200).send({success:"The user was successfully updated."})
}