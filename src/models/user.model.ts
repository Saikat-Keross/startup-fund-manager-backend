import mongoose from 'mongoose';

export interface UserDocument extends mongoose.Document {
    username: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
     roles: string[];
     companyName : string;
    //roles: { type: [String], enum: ['admin', 'user', 'investor','fundraiser'], default: ['user'] },
    //isRoleApproved: boolean;
}

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: { type: [String], enum: ['admin', 'user', 'investor','fundraiser'], default: ['user']},
    companyName : { type: String, required: function(this: any) { return this.roles.includes('fundraiser'); }},
    userImage: { type: String },
    userDescription: { type: String },
   /*  isRoleApproved: { type: Boolean, default: false } */
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);

export default User;

