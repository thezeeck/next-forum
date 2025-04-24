import { z } from 'zod';
import { sanitizeInput } from '../utils/sanitize';

const passwordValidation = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
);

export const InitialConfigurationSchema = z.object({
  name: z.string().max(100)
    .refine(val => !/<script>/i.test(val), "No se permiten scripts")
    .transform(val => sanitizeInput.text(val)),
  description: z.string().max(250)
    .refine(val => !/<script>/i.test(val), "No se permiten scripts")
    .transform(val => sanitizeInput.text(val)),
  admin_email: z.string().email("Email inválido")
    .transform(val => sanitizeInput.email(val)),
  lang: z.string().max(10)
    .refine(val => !/<script>/i.test(val), "No se permiten scripts")
    .transform(val => sanitizeInput.text(val)),
  theme: z.string().max(100)
    .refine(val => !/<script>/i.test(val), "No se permiten scripts")
    .transform(val => sanitizeInput.text(val)),
  user_name: z.string().max(250)
    .transform(val => sanitizeInput.text(val)),
  user_email: z.string().email("Email inválido")
    .transform(val => sanitizeInput.email(val)),
  user_password: z.string().min(8).max(250)
    .regex(passwordValidation, { message: 'Your password is not valid' })
    .transform(val => sanitizeInput.email(val)),
  user_password_confirmation: z.string().max(250)
    .transform(val => sanitizeInput.email(val)),
})
  .refine((data) => data.user_password === data.user_password_confirmation, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type InitialConfigurationFormState = undefined |
  {
    errors?: {
      name?: string[];
      description?: string[];
      admin_email?: string[];
      lang?: string[];
      theme?: string[];
      user_name?: string[];
      user_email?: string[];
      user_password?: string[];
      user_password_confirmation?: string[];
    };
    message?: string;
  }

export interface InitialFormData {
  name: string;
  description: string;
  admin_email: string;
  lang: string;
  theme: string;
  user_name: string;
  user_email: string;
  user_password: string;
  user_password_confirmation: string;
}