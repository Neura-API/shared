import mongoose, { Schema, Document } from "mongoose";

export interface IApiKey extends Document {
  key: string;
  userId: string;
  name: string;
  enabled: boolean;
  createdAt: Date;
  lastUsedAt?: Date;
  totalRequests: number;
  totalTokens: number;
  totalCost: number;
}

const ApiKeySchema = new Schema<IApiKey>({
  key: { type: String, required: true, unique: true },
  userId: { type: String, ref: "User", required: true },
  name: { type: String, required: true },
  enabled: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  lastUsedAt: { type: Date },
  totalRequests: { type: Number, default: 0 },
  totalTokens: { type: Number, default: 0 },
  totalCost: { type: Number, default: 0 },
});

export const ApiKey =
  (mongoose.models.ApiKey as mongoose.Model<IApiKey>) ||
  mongoose.model<IApiKey>("ApiKey", ApiKeySchema);
