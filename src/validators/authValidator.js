import { z } from 'zod';

// This schema is used to validate the data when a user registers
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phoneNumber: z.string().regex(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
  email: z.string().email('Invalid email').optional(),
  password: z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=[\]{};':"\\|,.<>/?]).{8,}$/,
    'Password must include uppercase, lowercase, number, and special character'
  )
});

// This schema is used to validate the data when a user logs in

export const loginSchema = z.object({
  phoneNumber: z
    .string()
    .regex(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
});

///This schema is used to validate the data when user imports contacts
export const importContactsSchema = z.array(
  z.object({
    name: z.string().min(2),
    phoneNumber: z.string().regex(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
  })
);


export const spamReportSchema = z.object({
  phoneNumber: z.string().regex(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
});
