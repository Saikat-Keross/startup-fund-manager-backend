import mongoose from 'mongoose'
import User from './user.model'
import Fundraiser from './fundraiser.model'

export interface TransactionDocument extends mongoose.Document {
  fundraiserId: mongoose.Schema.Types.ObjectId; // Links to the associated fundraiser
  userId?: mongoose.Schema.Types.ObjectId;
  amount: string;
  currency: string;
  transactionId: string; // Stripe transaction ID
  status: string; // Payment status
  amountRefunded?: number;
  refundId?: string;
  refundStatus?: string
}


export const transActionSchema = new mongoose.Schema({
  transactionId: { type: String, required: true },
  fundraiserId: { type: mongoose.Schema.Types.ObjectId, ref: 'Fundraiser', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  amount: { type: String, required: true },
  currency: { type: String, required: true },
  status: { type: String, enum: ['succeeded', 'refunded', 'partially_refunded', 'failed'], default: 'succeeded' },
  refundId: { type: String },
  refundStatus: {
    type: String, enum: ['pending', 'succeeded', 'failed', 'canceled'], required: false,
  },
  amountRefunded: { type: Number, default: 0 }
}, { timestamps: true })

const Transaction = mongoose.model('Transaction', transActionSchema)

export default Transaction;