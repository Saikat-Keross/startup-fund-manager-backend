import { Document, Schema, model } from "mongoose";

// export interface CampaignDocument extends Document {
//   ourTeam?: Array<{
//     name: string;
//     position: string;
//     avatar?: string;
//     about?: string;
//   }>;
//   additionalHighlights?: Array<{
//     title: string;
//     description?: string;
//   }>;
//   currencyType: "USD" | "EUR" | "GBP" | "JPY";
//   highlights?: Array<{
//     description: string;
//     id?: number;
//   }>;
//   title: string;
//   story: string;
//   category: "CleanTech" | "FinTech" | "HealthTech" | "EdTech" | "AI/ML" | "Blockchain" | "IoT" | "Other";
//   goalAmount: number;
//   endDate: Date;
//   imageUrl: string;
//   owner: {
//     name: string;
//     email: string;
//     stripeId: string;
//   };
//   publishedStatus?: boolean;
// }

export interface CampaignDocument extends Document {
    // highlights?: Array<{
    //   description: string;
    //   id?: number;
    // }>;
    ourTeam?: Array<{
      name: string;
      position: string;
      avatar?: string;
      about?: string;
    }>;
    title: string;
    story: string;
    //resourceUrl: string;
    imageUrl: string;
    category: 'CleanTech' | 'FinTech' | 'HealthTech' | 'EdTech' | 'AI/ML' | 'Blockchain' | 'IoT' | 'Other';
    goalAmount: number;
    currencyType: 'USD' | 'EUR' | 'GBP' | 'JPY';
    owner: {
      name: string;
      email: string;
      stripeId: string;
    };
    publishedStatus?: boolean;
    // additionalHighlights?: Array<{
    //   title: string;
    //   description?: string;
    // }>;
    pitch?: string;
    businessName: string;
    businessIdea: string;
    valueProposition: string;
    // businessModelDoc?: FileList;
    // businessPlanDoc?: FileList;
    businessModelDoc?: string;
    businessPlanDoc?: string;
    targetMarket: string;
    marketSize: string;
    competitiveAnalysis: string;
    //revenueStreams: string;
    //costStructure: string;
    //executiveSummary: string;
    //shortTermGoals: string;
    //longTermGoals: string;
    //marketingStrategy: string;
    //businessLocation: string;
    //technologyNeeds: string;
    //supplyChain: string;
    //teamMembers: string;
    //rolesResponsibilities: string;
    //startupCosts: string;
    //projectedRevenue: string;
    //breakEvenPoint: string;
    fundingNeeded: string;
    useOfFunds: string;
    //businessEntity: string;
    //licensesPermits: string;
    risksAndChallenges: string;
    keyMilestones: string;
    metricsForSuccess: string;
    // valuation?: {
    //   currentValuation?: number;
    //   lastValuation?: number;
    //   currencyUnit?: 'USD' | 'EUR' | 'GBP' | 'JPY' | 'INR';
    // };
  }

// const campaignSchema = new Schema({
//     ourTeam: [
//       {
//         name: { type: String, required: true },
//         position: { type: String, required: true },
//         avatar: { type: String },
//         about: { type: String },
//       },
//     ],
//     additionalHighlights: [
//       {
//         title: { type: String, required: true },
//         description: { type: String },
//       },
//     ],
//     currencyType: {
//       type: String,
//       enum: ['USD', 'EUR', 'GBP', 'JPY'],
//       required: true,
//     },
//     highlights: [
//       {
//         description: { type: String, required: true },
//         id: { type: Number },
//       },
//     ],
//     title: { type: String, required: true, minlength: 10 },
//     story: { type: String, required: true, minlength: 100 },
//     category: {
//       type: String,
//       enum: ['CleanTech', 'FinTech', 'HealthTech', 'EdTech', 'AI/ML', 'Blockchain', 'IoT', 'Other'],
//       required: true,
//     },
//     goalAmount: { type: Number, required: true, min: 1 },
//     endDate: { type: Date, required: true },
//     imageUrl: { type: String, required: true },
//     owner: {
//       name: { type: String, required: true },
//       email: { type: String, required: true },
//       stripeId: { type: String, required: true },
//     },
//     publishedStatus: { type: Boolean },
// });

// Optionally, export the model if you plan to use it elsewhere:

const campaignSchema = new Schema({
    // highlights: [
    //   {
    //     description: { type: String, required: true },
    //     id: { type: Number },
    //   },
    // ],
    ourTeam: [
      {
        name: { type: String, required: true },
        position: { type: String, required: true },
        avatar: { type: String },
        about: { type: String },
      },
    ],
    title: { type: String, required: true, minlength: 1 },
    story: { type: String, required: true, minlength: 10 },
    //resourceUrl: { type: String, required: true },
    imageUrl: { type: String, required: true },
    category: {
      type: String,
      enum: [
        'CleanTech',
        'FinTech',
        'HealthTech',
        'EdTech',
        'AI/ML',
        'Blockchain',
        'IoT',
        'Other',
      ],
      required: true,
    },
    goalAmount: { type: Number, required: true, min: 1 },
    currencyType: {
      type: String,
      enum: ['USD', 'EUR', 'GBP', 'JPY'],
      required: true,
    },
    owner: {
      name: { type: String, required: true, minlength: 1 },
      email: { type: String, required: true },
      stripeId: { type: String, required: true, minlength: 1 },
    },
    publishedStatus: { type: Boolean },
    // additionalHighlights: [
    //   {
    //     title: { type: String, required: true },
    //     description: { type: String },
    //   },
    // ],
    pitch: { type: String, minlength: 10 },
    businessName: { type: String, required: true, minlength: 2 },
    businessIdea: { type: String, required: true, minlength: 10 },
    valueProposition: { type: String, required: true, minlength: 10 },
    // Using Schema.Types.Mixed for file uploads; adjust as needed based on your file storage strategy.
    // businessModelDoc: { type: Schema.Types.Mixed },
    // businessPlanDoc: { type: Schema.Types.Mixed },
    businessModelDoc: { type: String },
    businessPlanDoc: { type: String },
    targetMarket: { type: String, required: true, minlength: 10 },
    marketSize: { type: String, required: true, minlength: 1 },
    competitiveAnalysis: { type: String, required: true, minlength: 10 },
    //revenueStreams: { type: String, required: true, minlength: 10 },
    //costStructure: { type: String, required: true, minlength: 10 },
    //executiveSummary: { type: String, required: true, minlength: 10 },
    //shortTermGoals: { type: String, required: true, minlength: 10 },
    //longTermGoals: { type: String, required: true, minlength: 10 },
    //marketingStrategy: { type: String, required: true, minlength: 10 },
    //businessLocation: { type: String, required: true, minlength: 2 },
    //technologyNeeds: { type: String, required: true, minlength: 10 },
    //supplyChain: { type: String, required: true, minlength: 10 },
    //teamMembers: { type: String, required: true, minlength: 10 },
    //rolesResponsibilities: { type: String, required: true, minlength: 10 },
    //startupCosts: { type: String, required: true, minlength: 1 },
    //projectedRevenue: { type: String, required: true, minlength: 1 },
    //breakEvenPoint: { type: String, required: true, minlength: 1 },
    fundingNeeded: { type: String, required: true, minlength: 1 },
    useOfFunds: { type: String, required: true, minlength: 10 },
    //businessEntity: { type: String, required: true, minlength: 2 },
    //licensesPermits: { type: String, required: true, minlength: 10 },
    risksAndChallenges: { type: String, required: true, minlength: 10 },
    keyMilestones: { type: String, required: true, minlength: 10 },
    metricsForSuccess: { type: String, required: true, minlength: 10 },
    // valuation: {
    //   currentValuation: { type: Number },
    //   lastValuation: { type: Number },
    //   currencyUnit: {
    //     type: String,
    //     enum: ['USD', 'EUR', 'GBP', 'JPY', 'INR'],
    //   },
    // },
  });
  

const Campaign = model<CampaignDocument>('Campaign', campaignSchema);

export default Campaign;