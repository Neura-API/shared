import mongoose from "mongoose";

export async function connectDatabase(uri?: string) {
  const mongodbUri =
    uri || process.env.MONGODB_URI || "mongodb://localhost:27017/api-gateway";

  await mongoose.connect(mongodbUri);

  return mongoose.connection;
}
