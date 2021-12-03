const machineCategoryModel = require("../models/machineCategory.model")



exports.getAllMachineCategories = async(req,res)=>{


    try{
        var machineCategories = await machineCategoryModel.find();
        res.status(200).send({success:"The machine categories where retreived successfully",data:{machineCategories:machineCategories}})

    }
    catch{
        console.log(error)
        res.status(400).send({error:"There was an error"})
    }

}