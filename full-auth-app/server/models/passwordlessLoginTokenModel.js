import mongoose from 'mongoose';

const passwordlessLoginTokenSchema = mongoose.Schema(
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

const PasswordlessLoginToken = mongoose.model('passwordlessLoginToken', passwordlessLoginTokenSchema);

export default PasswordlessLoginToken;
