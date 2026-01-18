const express=require("express");
const router=express.Router();
const expense=require('../models/expense');

router.post('/addexpense',async(req,res)=>{
    try{
        console.log("Request body:", req.body);
        const {spent,amount,mode,month,description}=req.body;
        const expensedata={
            spent,
            amount,
            mode,
            description,
            month
        }
        const newexpense=new expense(expensedata);
        const savedexpense=await newexpense.save();
        res.status(201).json(savedexpense);
    }
    catch(err){
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

module.exports=router;