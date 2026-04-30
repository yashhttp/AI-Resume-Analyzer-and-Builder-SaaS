import dotenv from 'dotenv';
dotenv.config();
import app from './src/app.js'


import connectDb from './src/config/db.js';



// connect db
connectDb();
app.get("/", (req, res)=>{
    res.json({
        sucess:true,
        message: "AI SaaS Backend Running 🚀"
    })

})
const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
     console.log(`Server running on port ${PORT}`);
})