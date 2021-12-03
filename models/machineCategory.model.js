const mongoose = require('mongoose');

//Here we define the User Model


const machineCategorySchema = new mongoose.Schema({

    name:{
        type:String
    }
  
});


module.exports = mongoose.model("Machine Category",machineCategorySchema, "Machine Categories");