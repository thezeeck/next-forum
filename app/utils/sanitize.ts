import validator from 'validator';
import { escape } from 'sqlstring'; 

export const sanitizeInput = {
  text: (input: string) => validator.escape(input.trim()),
  email: (input: string) => validator.normalizeEmail(input.trim()),
  sql: (input: string) => escape(input),
  url: (input: string) => validator.escape(input.trim()),
}