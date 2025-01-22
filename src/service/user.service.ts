import { DocumentDefinition } from 'mongoose';
import User,{ UserDocument } from "../models/user.model";
import UserRole from "../models/userRole.model";
import jwt from 'jsonwebtoken';

export async function createUser(input: DocumentDefinition<UserDocument>) {
  try {
    const user = await User.create(input);
    return user;
  } catch (ex: any) {
    throw new Error(ex);
  }
}

export async function getUsers() {
  try {
    const users = await User.find();
    return users;
  } catch (ex: any) {
    throw new Error(ex);
  }
}

export async function getUserById(id: string) {
  try {
    const user = await User.findById(id);
    return user;
  } catch (ex: any) {
    throw new Error(ex);
  }
}

export async function updateUser(id: string, input: DocumentDefinition<UserDocument>) {
  try {
    const user = await  User.findById(id);
    if (!user) {
        throw new Error('User not found');
        }
    user.username = input.username;
    user.email = input.email;
    user.password = input.password;
    user.save();
    return user;
  }
    catch (ex: any) {
        throw new Error(ex);
    }
}

export async function deleteUser(id: string) {
    try {
        const  user = await User.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        user.remove();
        return true;
    }
    catch (ex: any) {
        throw new Error(ex);
    }
}

export async function getAllUsers() {
    try {
        const users = await User.find();
        return users;
    } catch (ex: any) {
        throw new Error(ex);
    }
}

export async function getAllRoleRequests() 
{
    try {
        const roleRequests = await UserRole.find({approvalStatus : 'pending'});
        return roleRequests;
    } catch (ex: any) {
        throw new Error(ex);
    }

}

export async function getRoleRequest(id: string) 
{
    try {
        const roleRequest = await UserRole.findOne({userId : id});
        let message = "", role = "", status = "", reason = "",obj = {};
        if(roleRequest == null)
        {
            message = "No role request found for the user";
            role = "n/a";
            status = "n/a";
            obj = {message : message, role :role};
            //return obj;
        }
        else
        {

            if(roleRequest.status == "pending")
            {
              message = "Role request is pending";
              status = "pending";
            }else if(roleRequest.status == "approved"){
              message ="Role request was approved";
              status = "approved";
              reason = roleRequest.reason ? roleRequest.reason : "n/a";
            }
            else{
              message = "Role request was rejected";
              status = "rejected";
              reason = roleRequest.reason;
            }
            role = roleRequest.role;
            obj = {message : message, role :role, status : status, reason : reason};
        }
        return obj;
        //return roleRequest;
    } catch (ex: any) {
        throw new Error(ex);
    }

}

