import { DocumentDefinition } from 'mongoose';
import User,{ UserDocument } from "../models/user.model";

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

