//Libraries
const path = require("path");
const fs =require("fs")
const express = require("express");
const cors = require('cors');
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");


//Middlewares
const dbConnect = require('./middlewares/dbConnect');

//Routers
const userRouter = require("./routers/user.router")
const machineRouter =require("./routers/machine.router")
const messageRouter = require("./routers/message.router")
const machineCategoryRouter = require("./routers/machineCategory.router")

//Initiallizing the app
const app = express();

//Configurations
dotenv.config();

//Middleware configuration
app.use(cors());

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: false,limit:"50mb" ,parameterLimit:50000}));
app.use(express.urlencoded({extended:false,limit:"50mb",parameterLimit:50000}));


app.use(fileUpload());

app.use(express.static(path.join(__dirname,"files")))

//Static files
//app.use(express.static("Media"));
app.use(express.static("public"));
//Client serving



//Routing

app.use("/api/users",userRouter)
app.use("/api/machines",machineRouter)
app.use("/api/messages",messageRouter)
app.use("/api/machineCategories",machineCategoryRouter)

app.get("/files/:userID/account/:fileName",async(req,res)=>{

    res.download(__dirname + "/files/" + req.params.userID +"/account/"  + req.params.fileName)
  //  var file = fs.createReadStream(__dirname + "/files/" + req.params.userID +"/machines/" + req.params.machineID + "/" + req.params.fileName)
    //file.pipe(res)
})
app.get("/files/:userID/machines/:machineID/:fileName",async(req,res)=>{
    //res.setHeader('Content-Type', 'application/pdf');
   // res.setHeader('Content-Disposition', 'attachment; filename=quote.pdf');
    res.download(__dirname + "/files/" + req.params.userID +"/machines/" + req.params.machineID + "/" + req.params.fileName)
  //  var file = fs.createReadStream(__dirname + "/files/" + req.params.userID +"/machines/" + req.params.machineID + "/" + req.params.fileName)
    //file.pipe(res)
})
app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname,"public","index.html"))
})
//Initializing the server
app.listen(process.env.PORT, (err)=>{
    if(err){
        console.log(err);
    }
    else{
        console.log("Running on: " +process.env.PORT)
        dbConnect(process.env.DB_URI);
    }
})
