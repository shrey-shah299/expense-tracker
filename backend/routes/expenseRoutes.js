const express=require("express");
const router=express.Router();
const expense=require('../models/expense');

router.get('/allexpenses',async(req,res)=>{
    try{
        const alltransactions=await expense.find()
        .sort({createdAt:-1});
        res.status(200).json(alltransactions);
    }
    catch(err){
        console.log(err);
    }
});

router.get('/expenses/current-month',async(req,res)=>{
    try{
        const currentmonth=new Date().toLocaleString('en-US',{
            month:'long',
        });

         const expenses = await expense.find({
      month: currentmonth,
    })
        .collation({ locale: 'en', strength: 2 }) //case sensitivity
        .sort({createdAt:-1});

        const monthlySpent = expenses.reduce(
      (sum, item) => sum + item.amount,
      0
    );

        res.status(200).json({
      month: currentmonth,
      monthlySpent,
    });
    }
    catch(err){
        console.log(err);
    }
});

router.get('/expenses/mode/:mode',async(req,res)=>{
    try{
        const mode=req.params.mode.toUpperCase();

        const expenses=(await expense .find({mode}))
        .collation({ locale: 'en', strength: 2 })
        .sort({createdAt:-1})
        res.status(200).json(expenses);
    }
    catch(err){
        console.log(err);
    }
});

router.get('/total-spent',async(req,res)=>{
    try{
        const result=await expense.aggregate([
            {
            $group: {
                _id:null,
                total:{$sum:"$amount"}
            }
        }
        ]);
        res.status(200).json({totalSpent:result[0]?.total||0});
    }
    catch(err){
        console.log(err);
    }
});

router.get('/spent-this-month', async (req, res) => {
  try {
    const start = new Date();
    start.setDate(1);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    const result = await expense.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lt: end }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" }
        }
      }
    ]);

    res.json({ monthlySpent: result[0]?.total || 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/spent-by-mode', async (req, res) => {
  try {
    const result = await expense.aggregate([
      {
        $group: {
          _id: { $toLower: "$mode" },
          total: { $sum: "$amount" }
        }
      }
    ]);

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports=router;