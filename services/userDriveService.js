const googleDrive = require("../drive/quickstart/index")
const {google} = require('googleapis');
const { Readable } = require('stream');
const path = require("path")

async function createFolder(auth,folderName,parents){

    const drive = google.drive({version: 'v3', auth});
    if(parents){
        var fileMetadata = {
            'name': folderName,
            'mimeType': 'application/vnd.google-apps.folder',
            parents:parents
            };
    }else{
        var fileMetadata = {
            'name': folderName,
            'mimeType': 'application/vnd.google-apps.folder',
           
            };
    }

    return await drive.files.create({
        resource: fileMetadata,
        fields: 'id,parents'
    })
}


async function uploadFile(auth,file,parents){
    console.log(file)
    const drive = google.drive({version: 'v3', auth});
    var fileMetadata = {
        'name': file.name,
        parents:parents
      };
      var media = {
        mimeType: 'image/png',
        body: new Readable({
            read() {
              this.push(file.data);
              this.push(null);
            }
          })
      };
      return await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id'
      })
  
}

async function folderOrFileExists(auth,fileName,parents){
    const drive = google.drive({version: 'v3', auth});
    var pageToken = null
    var files = await drive.files.list({
        fields: 'nextPageToken, files(id, name),files/parents',
        spaces: 'drive',
   
        q:"name='"+fileName+"'"
    })
   
    if(files.data.files.length>0){
        if(parents){
            for(var file of  files.data.files){
                if(JSON.stringify(file.parents)==JSON.stringify(parents)){
                    return file;
                }
            }
        }else{
            return files.data.files[0]
        }
   
    }
    return null;
}


function UserDriveService(userID){

    this.userID = userID;
    this.userFolder = path.join(__dirname,"../files",this.userID)
    this.userAccountFolder = path.join(__dirname,"../files",this.userID,"account")
    this.userMachinesFolder =path.join(__dirname,"../files",this.userID,"machines")
    
    this.uploadFile = async(file,parents,cb)=>{
        
        googleDrive(async (auth)=>{
            var fileCreated = await uploadFile(auth,file,parents)
            cb(fileCreated.data)
        });
    }

    this.userFolderExists = async (cb)=>{

        googleDrive(async (auth)=>{

            var cecloudFolder = await folderOrFileExists(auth,"cecloud",null)
            console.log("CECLOUD")
            console.log(cecloudFolder)
            if(cecloudFolder){
                var userFolder = await folderOrFileExists(auth,this.userID,[cecloudFolder.id.toString()])
                console.log("USER FOLDER")
                console.log(userFolder)
                console.log(this.userID)
                if(userFolder){
                    cb(true,cecloudFolder.id,userFolder)
                }else{
                    cb(false,cecloudFolder.id,userFolder)
                }
            }else{
                cecloudFolder = await createFolder(auth,"cecloud",[])
                cb(false,cecloudFolder.data.id,null)
            }
        })
       
    }

    this.createUserFolder = (cb)=>{
        googleDrive(async (auth)=>{
            this.userFolderExists(async (userFolderExists,ceCloudFolderID,userFolder)=>{
                if(!userFolderExists){
                    var userFolder = await createFolder(auth,this.userID,[ceCloudFolderID])
                    cb({
                        error:null,
                        ceCloudFolderID:ceCloudFolderID,
                        userFolderID:userFolder.data.id
                    })
                }else{
                    cb({
                        error:"The folder already exists.",
                        ceCloudFolderID:ceCloudFolderID,
                        userFolderID:userFolder.id
                    })
                }
            })
        })
    }


    this.createUserFilesystem = (response,cb)=>{
        googleDrive(async (auth)=>{
            this.createUserFolder(async (res)=>{ 
                var userAccountFolderID = null
                var userMachinesFolderID = null

                var userAccountFolder = await folderOrFileExists(auth,"account",[res.userFolderID]);
                if(!userAccountFolder){
                    userAccountFolder = await createFolder(auth,"account",[res.userFolderID])
                    userAccounFolderID = userAccountFolder.data.id
                } else{
                    userAccountFolderID = userAccountFolder.id
                }
                var userMachinesFolder = await folderOrFileExists(auth,"machines",[res.userFolderID]);
                if(!userMachinesFolder){
                    userMachinesFolder = await createFolder(auth,"machines",[res.userFolderID])
                    userMachinesFolderID=  userMachinesFolder.data.id
                }else{
                    userMachinesFolderID=userMachinesFolder.id
                }
                
                cb({
                    ceCloudFolderID:res.ceCloudFolderID,
                    userFolderID:res.userFolderID,
                    userAccountFolderID:userAccountFolderID,
                    userMachinesFolderID:userMachinesFolderID,
                    response:response
                })
            })

        })


    }

    /*this.createUserMachineFolder = (machineID)=>{
        try{
            //this.createUserFolder(this.userID)
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

    this.clearUserFolder = ()=>{
        try{
            if(fs.existsSync(path.join(__dirname,"../files",this.userID))){
                fs.rmdirSync(path.join(__dirname,"../files",this.userID), { recursive: true, force: true })
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
            success:"The user folder was deleted."
           
        }  
    }*/


}




module.exports = UserDriveService;
