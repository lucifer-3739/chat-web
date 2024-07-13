import mongoose, { Schema, Document } from 'mongoose';

interface IEmailVerification extends Document {
    userId: mongoose.Types.ObjectId;
    otp: number;
    createdAt: Date;
}

const EmailVerificationSchema: Schema = new Schema({
    userId: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
    otp: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now, expires: 900 }, // expires in 15 minutes
});

export default mongoose.models.EmailVerification || mongoose.model<IEmailVerification>('EmailVerification', EmailVerificationSchema);
