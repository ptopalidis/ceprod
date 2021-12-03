const fs = require('fs')
const path = require("path")

function UserFolderService(userID){

    this.userID = userID;
    this.userFolder = path.join(__dirname,"../files",this.userID)
    this.userAccountFolder = path.join(__dirname,"../files",this.userID,"account")
    this.userMachinesFolder =path.join(__dirname,"../files",this.userID,"machines") 

    this.userFolderExists = ()=>{
       
        return fs.existsSync(this.userFolder);
    }

    this.createUserFolder = ()=>{
        if(!this.userFolderExists(this.userID)){
            try{
                fs.mkdirSync(this.userFolder)
                return {
                    success:"The folder was created."
                }
            }
            catch(error){
                console.log(error)
                return {
                    error:"There was a problem."
                }
            }
      
        }else{
            return {
                error:"The folder already exists."
            }
        }
    }


    this.createUserFilesystem = ()=>{
        
        try{
            this.createUserFolder(this.userID)
            if(!fs.existsSync(this.userAccountFolder)){
                fs.mkdirSync(this.userAccountFolder);
            }
            if(!fs.existsSync(this.userMachinesFolder)){
                fs.mkdirSync(this.userMachinesFolder);
            }
        }
        catch(error){
            console.log(error)
            return {
                error:"There was a problem."
            }
        }
        return {
            success:"The filesystem was created."
        }

    }

    this.createUserMachineFolder = (machineID)=>{
        try{
            this.createUserFolder(this.userID)
            if(!fs.existsSync(this.userMachinesFolder + "/" + machineID)){
                fs.mkdirSync(this.userMachinesFolder + "/" + machineID);
            }
        }
        catch(error){
            console.log(error)
            return {
                error:"There was a problem.",
                folder:null
            }
        }
        return {
            success:"The folder was created.",
            data:{
                folder:this.userMachinesFolder + "/" + machineID
            }
        }  
    }


}




module.exports = UserFolderService;