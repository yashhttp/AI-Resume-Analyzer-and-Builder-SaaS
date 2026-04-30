import mongoose from 'mongoose';

const connectDb = async()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            dbName:"AI_SaaS"
        })
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }catch(err){
        console.error("MongoDb connection failed")
        process.exit(1)
    }

}

export default connectDb;