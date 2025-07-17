import { config } from "dotenv";
config();
import mongoose from "mongoose"
//Connecting to mongodb server
export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (error) {
        console.log(`MongoDB Connection ERROR: `, error)
    }
}
