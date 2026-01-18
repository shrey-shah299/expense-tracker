require('dotenv').config();
const cors = require('cors');
const express=require('express');

const mongoose=require("mongoose");

const app=express()
const port=3000

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
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require('./models/expense');
const adminRoutes=require('./routes/adminRoutes')

app.use('/api', adminRoutes);

app.listen(port,()=>{
    console.log(`Server running on http://localhost:${port}`);
})