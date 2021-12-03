//Libraries
const path = require("path");
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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({extended:false}));
app.use(bodyParser.json());
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
