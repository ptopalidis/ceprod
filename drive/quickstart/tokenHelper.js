const fs = require("fs")
const path = require("path")
const {google} = require('googleapis');
const SCOPES = ['https://www.googleapis.com/auth/drive'];
const TOKEN_PATH = path.join(__dirname,"token.json")
const credentials = JSON.parse(fs.readFileSync(path.join(__dirname,"credentials.json")))
const {client_secret, client_id, redirect_uris} = credentials.installed;
const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]);


exports.getAuthUrl = ()=>{
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    return authUrl; 
}


exports.generateToken = (code)=>{
    if(!code || code==""){
        return;
    }
    if(fs.existsSync(TOKEN_PATH)){
        fs.unlinkSync(TOKEN_PATH)
    }
    oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
            if (err) return console.error(err);
            console.log('Token stored to', TOKEN_PATH);
        });
    })
}