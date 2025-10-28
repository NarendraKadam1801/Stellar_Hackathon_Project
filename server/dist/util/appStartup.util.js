import mongoose from "mongoose";
export const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || "mongodb+srv://devteam:ankitmahar@cluster0.os2bqhl.mongodb.net/?appName=Cluster0";
        await mongoose.connect(mongoURI);
        console.log("✅ MongoDB connected successfully");
    }
    catch (error) {
        console.error("❌ MongoDB connection error:", error);
        process.exit(1);
    }
};
export const disconnectDB = async () => {
    try {
        await mongoose.disconnect();
        console.log("✅ MongoDB disconnected successfully");
    }
    catch (error) {
        console.error("❌ MongoDB disconnection error:", error);
    }
};
//# sourceMappingURL=appStartup.util.js.map