import { number, object, string } from 'zod';

export const contributionSchema = object({
  body: object({
    amount: number({
      required_error: 'A contribution amount is required.',
    }),
    fundraiserId: string({
      required_error: 'A valid Fundraiser document ID is required.',
    }),
    donorName: string({
      required_error: 'A valid donor name is required.',
    }),
      message: string({
        required_error: 'A valid message is required.',
    }).optional()
  }),
});
