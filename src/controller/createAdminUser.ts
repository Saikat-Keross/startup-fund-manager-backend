import User from "../models/user.model"
import { Request, Response, NextFunction } from "express"
import bcrypt from 'bcrypt';

const createDefaultAdmin = async () => {
    const adminEmail = 'admin@example.com';
    const adminPassword = 'admin';
    
    const existingAdmin = await User.findOne({ email: adminEmail, roles: { $in: ['admin'] } });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      const adminUser = new User({
        email: adminEmail,
        password: hashedPassword,
        username : 'admin',
        roles: ['admin']
      });
      await adminUser.save();
      console.log('Default admin user created.');
    } else {
      console.log('Admin user already exists.');
    }
  };
  export { createDefaultAdmin };