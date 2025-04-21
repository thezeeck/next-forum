import { Pool, Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { DB_HOST, DB_USER, DB_PASSWORD, DB_URL, DB_PORT, DB_DATABASE } = process.env;

export const pool = new Pool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  connectionString: DB_URL,
  port: Number(DB_PORT) || 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const client = new Client({
  connectionString: DB_URL,
  user: DB_USER,
  host: DB_HOST,
  database: DB_DATABASE,
  password: DB_PASSWORD,
  port: Number(DB_PORT) || 5432,
});