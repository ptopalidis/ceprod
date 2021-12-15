const machineModel = require("../models/machine.model")
const userModel = require("../models/user.model")

//Services
const UserFolderService = require("../services/userFolderService")

//Libraries
const path = require("path")

var CryptoJS = require("crypto-js");


exports.postMachine = async(req,res)=>{
    try{
        await machineModel.create(req.body.machine);
        res.status(200).send({success:"The machine was created."})
    }catch(error){
        console.log(error);
        res.status(400).send({error:"An error occured."});
        return 
    }
}


exports.getMachineByID =async (req,res)=>{
    try{
        var machine = await machineModel.findOne({_id:req.params.machineID});
        console.log(machine)
        res.status(200).send({success:"The machine was found.",data:{machine:machine}})
    }
    catch(error){
        res.status(400).send({error:"An error occured."});
        return 
    }
}

exports.deleteMachineFile = async(req,res)=>{
    try{
        var machine = await machineModel.findOne({_id:req.body.machineID});
        console.log(req.body)
        var files = machine[req.body.fileType][req.body.fileMode].links;
        fileIndex= files.indexOf(req.body.file);
        files.splice(fileIndex,1);
        machine[req.body.fileType][req.body.fileMode].links = files;
        await machine.save();
        res.status(200).send({success:"The file was delete successfully."})
        return;
    }
    catch(error){
        console.log(error)
        res.status(400).send({error:"There was a problem."})
        return;
    }
}


exports.uploadMachineFile = async(req,res)=>{
    console.log(req.files)
    try{
        var machine = await machineModel.findOne({_id:req.body.machineID});
   
        var ufs = new UserFolderService(req.body.userID)
        ufs.createUserFilesystem();
        var machineFolder = (ufs.createUserMachineFolder(req.body.machineID)).data.folder
   

        try{
            var newFile = req.files?req.files.newFile:null;
            console.log(newFile)
            if(newFile){
                newFile.mv(path.join(machineFolder ,newFile.name));
                machine[req.body.fileType][req.body.fileMode].links.push(process.env.FILE_PATH +  "/"  + req.body.userID + "/machines/" + machine._id + "/" + newFile.name)
                machine.save();
                res.status(200).send({success:"There file was uploaded successfully"});
            }else{
                res.status(400).send({error:"There was a problem"});
                return
            }
        }
        catch(error){
            console.log(error)
            res.status(400).send({error:"There was a problem"});
            return
        }
       
    }
    catch(error){
        console.log(error)
        res.status(400).send({error:"There was a problem."})
        return;
    }

}

exports.updateMachine = async(req,res)=>{
    try{

        await machineModel.updateOne({_id:req.params.machineID},req.body.machine);
        res.status(200).send({success:"The machine  was successfully updated."})
    }
    catch(error){
        res.status(400).send({error:"There was a problem."});
        return;
    }

}

exports.deleteMachine = async(req,res)=>{
    try{

        await machineModel.deleteOne({_id:req.params.machineID});
        res.status(200).send({success:"The machine  was successfully deleted."})
    }
    catch(error){
        res.status(400).send({error:"There was a problem."});
        return;
    }

}

exports.updateMachineFiles = async(req,res)=>{


    try{
        console.log(req.body.machine)
        await machineModel.updateOne({_id:req.params.machineID},req.body.machine);
        res.status(200).send({success:"The files were successfully updated."})
    }
    catch(error){
        res.status(400).send({error:"There was a problem."});
        return;
    }
}


exports.generateFileCode = async(req,res)=>{
    try{
        var machine = await machineModel.findOne({_id:req.body.machineID});
        var user = await userModel.findOne({_id:machine.userID})
        var fileCode = machine.variableFiles[req.body.fid][req.body.fileIndicator].fileCode;
        console.log(machine._id)
        if(!fileCode || fileCode==""){
            fileCode = CryptoJS.AES.encrypt(machine._id.toString()+"|"+machine.name+"|"+machine.type+"|"+user.bussinesName +"|" + machine.variableFiles[req.body.fid].serialNumber ,"ptopalidisce").toString()
            machine.variableFiles[req.body.fid][req.body.fileIndicator].fileCode = fileCode
            await machine.save()
           
        }
        res.status(200).send({error:"",data:{fileCode:fileCode}})
        return;
    }
    catch(error){
        console.log(error)
        res.status(400).send({error:"There was an error"})
    }
}


exports.validateFile = async(req,res)=>{

    
    try{
        console.log(req.body.fileCode)
        var bytes  = CryptoJS.AES.decrypt(req.body.fileCode.toString(), "ptopalidisce");
        var originalText = bytes.toString(CryptoJS.enc.Utf8);

        console.log(originalText)
        var decodedData = originalText.split("|")
        var machine = await machineModel.findOne({_id:decodedData[0]});
      
        if(machine){
            res.status(200).send({success:"Το έγγραφο είναι έγκυρο",data:{decodedData:decodedData}})
            return;
        }
        res.status(400).send({error:"Το έγγραφο δεν είναι έγκυρο."})
        return;
    }
    catch(error){
        console.log(error)
        res.status(400).send({error:"There was an error"})
    }
}