const express=require("express");
const router=express.Router();
const expense=require('../models/expense');
const Balance=require('../models/balance');

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

        // Auto-deduct from the corresponding wallet balance
        try {
            const balanceEntry = new Balance({
                mode,
                amount: Number(amount),
                type: 'remove',
            });
            await balanceEntry.save();
        } catch (balErr) {
            // Log but don't fail the expense save if balance update fails
            console.error("Failed to auto-deduct balance for mode:", mode, balErr.message);
        }

        res.status(201).json(savedexpense);
    }
    catch(err){
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

module.exports=router;