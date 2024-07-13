import mongoose from 'mongoose';

export const ConnectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;

    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/auth');
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection error:", error);
    }
};