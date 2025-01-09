import { number, object, string } from 'zod';

export const createUserSchema = object({
  body :object({
        username: string({
            required_error: 'Username is required',
        }),
        email: string({
            required_error: 'Email is required',
        }),
        password: string({
            required_error: 'Password is required',
        }),
    }),
});
