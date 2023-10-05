import mongoose from 'mongoose';

const resetPasswordTokenSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    // TODO: maybe it is not needed
    createdAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
    expiresAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ResetPasswordToken = mongoose.model('resetPasswordToken', resetPasswordTokenSchema);

export default ResetPasswordToken;
