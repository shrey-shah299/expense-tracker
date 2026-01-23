require('dotenv').config();
const cors = require('cors');
const express=require('express');

const mongoose=require("mongoose");

const app=express()
const port=3000
app.use(cors({
  origin: 'https://expense-tracker-zeta-neon-88.vercel.app', // Your Vercel URL
  credentials: true
}));
const connectdb =async()=>{
    try{
     await mongoose.connect(process.env.MONGO_URI)
     console.log('database connected')
    }
    catch(error){
        console.log(error);
        process.exit(1);
    }
}
connectdb();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require('./models/expense');
const adminRoutes=require('./routes/adminRoutes')
const expenseRoutes=require('./routes/expenseRoutes')
app.use('/api', adminRoutes);
app.use('/api',expenseRoutes);

app.listen(port,()=>{
    console.log(`Server running on http://localhost:${port}`);
})