import mongoose from 'mongoose';
import { contributionSchema, ContributionDocument } from '../models/contribution.model';
//const UserRole = require('./userRole.model');
import User from './user.model';

export interface FundraiserDocument extends mongoose.Document {
    title: string;
    story: string;
    image_url: string;
    //category: string;
    goal_amount: number;
    current_amount: number;
    date: Date;
    //published: boolean;
    //owner: string;
    stripeId?: string;
    transactions?: string[];
    faves?: string;
    status?: string;
    end_date: Date;
    approved: boolean;
    approvedBy?: string;
    approvedAt?: Date;
    approvedComments?: string;
    draftId: string;

    //Added from campaign
    ourTeam?: Array<{
      name: string;
      position: string;
      avatar?: string;
      about?: string;
    }>;
    //title: string;
    //story: string;
    //image_url: string;
    category: 'CleanTech' | 'FinTech' | 'HealthTech' | 'EdTech' | 'AI/ML' | 'Blockchain' | 'IoT' | 'Other';
    //goal_amount: number;
    currencyType: 'USD' | 'EUR' | 'GBP' | 'JPY';
    owner: {
      name: string;
      email: string;
    };
    //end_date: string,
    published?: boolean;
    pitch?: string;
    businessName: string;
    businessIdea: string;
    valueProposition: string;
    businessModelPlanName?: string;
    businessModelDocName?: string;
    targetMarket: string;
    marketSize: string;
    competitiveAnalysis: string;
    businessLocation: string;
    technologyNeeds: string;
    supplyChain: string;
    startupCosts: string;
    projectedRevenue: string;
    breakEvenPoint: string;
    businessEntity: string;
    licensesPermits: string;
    risksAndChallenges: string;
    keyMilestones: string;
    userId: string;
}

const fundraiserSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    required: true,
    minLength: 10,
    maxLength: 255,
  },
  draftId:{
    type: String,
    required: true
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

  //commented 13-02-2025 after adding campaign
  // owner: {
  //   type: String,
  //   required: true,
  // },
  // email: {
  //   type: String,
  //   required: true,
  // },

  stripeId: {
    type: String
  },
  // contributions: {
  //   type: [contributionSchema],
  // },
  transactions: [
    {
      type: String,
    },
  ],
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
  },

  //Added from campaign
    ourTeam: [
      {
        name: { type: String, required: true },
        position: { type: String, required: true },
        avatar: { type: String },
        about: { type: String },
      },
    ],
    //title: { type: String, required: true, minlength: 1 },
    //story: { type: String, required: true, minlength: 10 },
    //image_url: { type: String, required: true },
    // category: {
    //   type: String,
    //   enum: [
    //     'CleanTech',
    //     'FinTech',
    //     'HealthTech',
    //     'EdTech',
    //     'AI/ML',
    //     'Blockchain',
    //     'IoT',
    //     'Other',
    //   ],
    //   required: true,
    // },
    //goal_amount: { type: Number, required: true, min: 1 },
    currencyType: {
      type: String,
      enum: ['USD', 'EUR', 'GBP', 'JPY'],
      required: true,
    },
    owner: {
      name: { type: String, required: true, minlength: 1 },
      email: { type: String, required: true }
    },
    //end_date: {type: String, required: true},
    pitch: { type: String, minlength: 10 },
    businessName: { type: String, required: false, minlength: 2 },
    businessIdea: { type: String, required: false, minlength: 10 },
    valueProposition: { type: String, required: false, minlength: 10 },
    businessModelDocName: { type: String , required: false},
    businessModelPlanName: { type: String , required: false},
    targetMarket: { type: String, required: false, minlength: 10 },
    marketSize: { type: String, required: false, minlength: 1 },
    competitiveAnalysis: { type: String, required: false, minlength: 10 },
    businessLocation: { type: String, required: true, minlength: 2 },
    technologyNeeds: { type: String, required: false, minlength: 10 },
    supplyChain: { type: String, required: false, minlength: 10 },
    startupCosts: { type: String, required: true, minlength: 1 },
    projectedRevenue: { type: String, required: true, minlength: 1 },
    breakEvenPoint: { type: String, required: true, minlength: 1 },
    businessEntity: { type: String, required: false, minlength: 2 },
    licensesPermits: { type: String, required: false, minlength: 10 },
    risksAndChallenges: { type: String, required: false, minlength: 10 },
    keyMilestones: { type: String, required: false, minlength: 10 }
});


fundraiserSchema.pre('save', async function (next) { 
  try {
    console.log("this.userId:", this.userId); 
    if (!this.userId) {
      return next(new Error('User ID is missing.'));
    }

    const user = await User.findById(this.userId);  
    if (!user || user.role !== 'fundraiser') { 
      return next(new Error('Only users with the "fundraiser" role can create a fundraiser.'));
    }

    next();
  } catch (error) {
    next(error);
  }
});

const Fundraiser = mongoose.model('Fundraiser', fundraiserSchema);

export default Fundraiser;
