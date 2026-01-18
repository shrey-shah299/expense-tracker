const mongoose=require("mongoose");

const expensemodel=new mongoose.Schema({
    spent:{
        type:String,
        required:true,
    },
    amount:{
        type:Number,
        required:true,
    },
    mode:{
        type:String,
        required:true,
        enum: ['cash','HDFC','SBI'],
    },
    month:{
         type:String,
         required:true,
    },
    description:{
        type:String,
        required:true,
    },
    CreatedAt:{
        type:Date,
        immutable:true,
        default:()=>Date.now()
    },
    UpdateAT:{
        type:Date,
        default:()=>Date.now()
    } 
});

module.exports=mongoose.model('Expense',expensemodel)