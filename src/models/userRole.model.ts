const mongoose = require('mongoose');

const userRoleSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['investor', 'fundraiser','admin'],
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  requestedAt : {
    type: Date,
  },
  field_of_interest : {
    type: [String],
    required : function(this:any){
        return this.role === 'investor';
    }
  },
  industry : {
    type: String,
    required : function(this:any){
        return this.role === 'fundraiser';
    }
  },
  kyc_document : {
    type: String,
    required : function(this:any){
        return this.role === 'investor';
    }
  },
  document_upload : {
    type: String,
    required : function(this:any){
        return this.role === 'investor';
    }
  },
  approvedBy : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'User',
    required : function(this:any){
        return this.approvalStatus === 'approved' || this.approvalStatus === 'rejected';
    }
  },
  investmentFocus : {
    type : String,
    required : function(this:any){
        return this.approvalStatus === 'approved' && this.role === 'investor';
    }
  },
  investmentAmount : {
    type : Number,
    required : function(this:any){
        return this.approvalStatus === 'approved' && this.role === 'investor';
    }
  },
  approvalDate: {
    type: Date,
  },
  comments: {
    type: String,
    required : function(this:any){
        return this.approvalStatus === 'rejected';
    }
  },
}, { timestamps: true });

const UserRole = mongoose.model('UserRole', userRoleSchema);

module.exports = UserRole;
