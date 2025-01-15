import mongoose from 'mongoose';

export interface UserDocument extends mongoose.Document {
    username: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    roles: string[];
    companyName: string;
    gender: string;
    avatar: string;
    //roles: { type: [String], enum: ['admin', 'user', 'investor','fundraiser'], default: ['user'] },
    //isRoleApproved: boolean;
}

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
   /*  isRoleApproved: { type: Boolean, default: false } */
    roles: { type: [String], enum: ['admin', 'user', 'investor', 'fundraiser'], default: ['user'] },
    companyName: { type: String, required: function (this: any) { return this.roles.includes('fundraiser'); } },
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
   // isRoleApproved: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);

export default User;

