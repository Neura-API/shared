import mongoose, { Schema, Document } from "mongoose";

export type UserType =
  | "freetrial"
  | "premium1"
  | "premium2"
  | "premium3"
  | "custom";

export interface IUser extends Document {
  userId: string;
  type: UserType;
  createdAt: Date;
  expiresAt?: Date;
  customRateLimit?: number;
  customCredits?: number;
  monthlyCreditsLimit: number;
  creditsUsed: number;
  availableCredits: number;
  rateLimit: number;
  lastCreditReset: Date;
}

const UserSchema = new Schema<IUser>({
  userId: { type: String, required: true, unique: true },
  type: {
    type: String,
    required: true,
    enum: ["freetrial", "premium1", "premium2", "premium3", "custom"],
    default: "freetrial",
  },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
  customRateLimit: { type: Number },
  customCredits: { type: Number },
  creditsUsed: { type: Number, default: 0 },
  lastCreditReset: { type: Date, default: Date.now },
});

UserSchema.virtual("monthlyCreditsLimit").get(function () {
  if (this.type === "custom") return this.customCredits || 0;

  const limits = {
    freetrial: 5,
    premium1: 20,
    premium2: 50,
    premium3: 100,
  };
  return limits[this.type];
});

UserSchema.virtual("rateLimit").get(function () {
  if (this.type === "custom") return this.customRateLimit || 0;

  const limits = {
    freetrial: 5,
    premium1: 10,
    premium2: 20,
    premium3: 40,
  };
  return limits[this.type];
});

UserSchema.virtual("availableCredits").get(function () {
  return this.monthlyCreditsLimit - this.creditsUsed;
});

UserSchema.set("toJSON", { virtuals: true });
UserSchema.set("toObject", { virtuals: true });

export const User =
  (mongoose.models.User as mongoose.Model<IUser>) ||
  mongoose.model<IUser>("User", UserSchema);
