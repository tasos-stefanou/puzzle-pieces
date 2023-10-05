import mongoose from 'mongoose'

const activateAccountTokenSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const ActivateAccountToken = mongoose.model(
  'activateAccountToken',
  activateAccountTokenSchema
)

export default ActivateAccountToken
