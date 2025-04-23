import { z } from 'zod';
import { sanitizeInput } from '../utils/sanitize';

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
});

export type InitialConfigurationFormState = undefined |
  {
    errors?: {
      name?: string[];
      description?: string[];
      admin_email?: string[];
      lang?: string[];
      theme?: string[];
    };
    message?: string;
  }

export interface InitialFormData {
  name: string;
  description: string;
  admin_email: string;
  lang: string;
  theme: string;
}