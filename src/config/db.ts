import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        // .env එකේ තියෙන MONGO_URI එක පාවිච්චි කරලා කනෙක්ට් වීම
        const conn = await mongoose.connect(process.env.MONGO_URI as string);
        console.log(`🛢️ MongoDB Connected Successfully: ${conn.connection.host}`);
    } catch (error: any) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        process.exit(1); // Error එකක් ආවොත් සර්වර් එක නවත්තන්න
    }
};

export default connectDB;