const machineCategoryModel = require("../models/machineCategory.model")


exports.createMachineCategory = async(req,res)=>{

    try{
        await machineCategoryModel.create(req.body.category);
        res.status(200).send({success:"The category was created."})
    }
    catch{
        console.log(error)
        res.status(400).send({error:"There was an error"})
    }
}

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