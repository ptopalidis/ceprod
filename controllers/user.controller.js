const userModel = require("../models/user.model");
const machineModel = require("../models/machine.model")
const path = require("path")
const fs = require("fs")
const googleDrive = require("../drive/quickstart/index")
const {google} = require('googleapis');
const { Readable } = require('stream');
//Services

const UserFolderService = require("../services/userFolderService");
const UserDriveService = require("../services/userDriveService.js")


exports.createUser = async(req,res)=>{
    try{
        var user = JSON.parse(req.body.user)
        console.log(user)
      var userToSave = {
          ...user,
          logo:"",
          signature:""
      }
   
      var existingUser = await userModel.findOne({username:userToSave.username});
      if(existingUser){
        res.status(400).send({error:"The user already exists."})
        return;
      }
      var createdUser = await userModel.create(userToSave);
      console.log("INSERTED ID ")
      console.log(createdUser)
      var uds=  new UserDriveService(createdUser._id.toString());
      await uds.createUserFilesystem(res,async (resp)=>{
          console.log("REUSLT")
          console.log(resp)
        var logo = req.files?req.files.logo:null;
        var signature = req.files?req.files.signature:null;
        if(logo){

            await uds.uploadFile(logo,[resp.userAccountFolderID],async (logoFile)=>{
                console.log(logoFile)
                createdUser.logo = `https://drive.google.com/uc?export=download&id=${logoFile.id}` 
                console.log(createdUser)   
                await userModel.updateOne({_id:createdUser._id},createdUser);          
            })     
        }
        if(signature){
    
            await uds.uploadFile(signature,[resp.userAccountFolderID],async (sigFile)=>{
                createdUser.signature = `https://drive.google.com/uc?export=download&id=${sigFile.id}`
                console.log(createdUser)   
                await userModel.updateOne({_id:createdUser._id},createdUser);
            })
        }

        resp.response.status(200).send({success:"Επιτυχής δημιουργία",data:{user:createdUser}})
        return
      })

    }
    catch(error){
        console.log(error)
        res.status(400).send({error:"Something went wrong."})
        return;
    }
}


exports.deleteUser = async(req,res)=>{
    try{
        var userFolderService = new UserFolderService(req.params.userID);
        var ufsResults = userFolderService.clearUserFolder();
        if(ufsResults.error){
            res.status(400).send({error:ufsResults.error});
            return;
        }
        await userModel.deleteOne({_id:req.params.userID});
        res.status(200).send({success:"The user was deleted successfully."})
    }
    catch(error){
        console.log(error)
        res.status(400).send({error:"Something went wrong."})
        return;
    }
}



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
    }else{
        res.status(404).send({success:"O χρήστης δεν βρέθηκε",data:{user:null}});
    }
}


exports.updateUser = async(req,res)=>{



    var user = JSON.parse(req.body.user);
    var actualUser = await userModel.findById(req.params.userID)
    console.log("ACT USERS")
    console.log(actualUser)
    var uds=  new UserDriveService(user._id);
  
        await uds.createUserFilesystem(res,async (resp)=>{
      
            var logo = req.files?req.files.logo:null;
            var signature = req.files?req.files.signature:null;
            user.logo = actualUser.logo
            user.signature = actualUser.signature
            if(logo){
                await uds.uploadFile(logo,[resp.userAccountFolderID],async (logoFile)=>{
                    console.log(logoFile)
                    user.logo = `https://drive.google.com/uc?export=download&id=${logoFile.id}` 
                    console.log(user)   
                    await userModel.updateOne({_id:req.params.userID},user);          
                })     
            }
            
    
            if(signature){
    
                await uds.uploadFile(signature,[resp.userAccountFolderID],async (sigFile)=>{
                    user.signature = `https://drive.google.com/uc?export=download&id=${sigFile.id}`
                    console.log(user)   
                    await userModel.updateOne({_id:req.params.userID},user);
                })
            }
  
            resp.response.status(200).send({success:"Επιτυχής ενημέρωση"})

        })


   
     

    
          
   
     

     
      
       






    //Manage user filesystem
    /*var userFolderService = new UserFolderService(user._id);
    var fsRes = userFolderService.createUserFilesystem();
    if(fsRes.error){
        res.status(400).send({error:fsRes.error})
        return
    }*/


    //Manage req images
   /* var logo = req.files?req.files.logo:null;
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
    }*/

   

   

}