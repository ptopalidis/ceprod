const tokenHelper = require("../drive/quickstart/tokenHelper")

exports.generateToken = async (req,res)=>{
    const code = req.body.code;
    tokenHelper.generateToken(code)
    res.send({message:"The token was generated"})
}

exports.getAuthUrl = async(req,res)=>{
    const authUrl = tokenHelper.getAuthUrl()
    res.send({authUrl:authUrl})
}