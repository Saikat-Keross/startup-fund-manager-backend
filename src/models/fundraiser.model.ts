import mongoose from 'mongoose';
import { contributionSchema, ContributionDocument } from '../models/contribution.model';

export interface FundraiserDocument extends mongoose.Document {
  title: string;
  story: string;
  image_url: string;
  category: string;
  goal_amount: number;
  current_amount: number;
  date: Date;
  published: boolean;
  owner: string;
  stripeId?: string;
  contributions?: [ContributionDocument];
  faves?: string;
  status?: string;
  end_date: Date;
  approved: boolean;
  approvedBy?: string;
  approvedAt?: Date;
  approvedComments?: string;
}

const fundraiserSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minLength: 10,
    maxLength: 255,
  },
  story: {
    type: String,
    required: true,
    minLength: 100,
    maxLength: 9999,
  },
  image_url: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  goal_amount: {
    type: Number,
    required: true,
  },
  current_amount: {
    type: Number,
    default: 0,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  published: {
    type: Boolean,
    default: true,
  },
  owner: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  stripeId: {
    type: String,
    required: true,
  },
  contributions: {
    type: [contributionSchema],
  },
  faves: {
    type: Number,
    default: 1,
  },
  end_date: {
    type: Date,
    required: true,
  },
  approved: {
    type: Boolean,
    default: false,
  },
  approvedBy: {
    type: String,
  },
  approvedAt: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'failed', 'completed'],
    required: true,
    default: 'pending',
  },
  approvedComments: {
    type: String,
    required: function (this: any) {
      return this.status === 'failed';
    },
  }
});

const Fundraiser = mongoose.model('Fundraiser', fundraiserSchema);

export default Fundraiser;
