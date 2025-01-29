import mongoose from 'mongoose';

export interface UserDocument extends mongoose.Document {
    username: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    role: string;
    companyName: string;
    gender: string;
    avatar: string;
    country: string;
    kycVerified: boolean;
    //roles: { type: [String], enum: ['admin', 'user', 'investor','fundraiser'], default: ['user'] },
    //isRoleApproved: boolean;
}

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String},
   /*  isRoleApproved: { type: Boolean, default: false } */
    //roles: { type: [String], enum: ['admin', 'user', 'investor', 'fundraiser'], default: ['user'] },
    role: { type: String, enum: ['investor', 'fundraiser','admin','user'], required: true, default: 'user' },
    companyName: { type: String, required: function (this: any) { return this.role == 'fundraiser'; } },
    userImage: { type: String },
    userDescription: { type: String },
    gender:{type: [String], enum: ['male','female','other']},
    avatar: {
        type: String,
        default: function(this:any) {
            if (this.gender === 'male') {
                return 'default_male_avatar.png';
            } else if (this.gender === 'female') {
                return 'default_female_avatar.png'; 
            } else {
                return 'default_other_avatar.png'; 
            }
        }
    },
    kycVerified: { type: Boolean, default: false },
    country: { type: String , default: 'us', required: function (this: any) { return this.role !== 'admin'; } },
   // isRoleApproved: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);

export default User;

