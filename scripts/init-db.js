/* eslint-disable @typescript-eslint/no-require-imports */
const dotenv = require('dotenv');
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

dotenv.config();

const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE, DB_URL, DB_PORT } = process.env;

const run = async () => {
  try {
    const rootClient = new Client({
        connectionString: DB_URL,
        user: DB_USER,
        host: DB_HOST,
        database: DB_DATABASE,
        password: DB_PASSWORD,
        port: DB_PORT,
      });
    await rootClient.connect();
    console.log('✅ Connected to Postgres server');
    
    // Create the database if it doesn't exist
    const res = await rootClient.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [DB_DATABASE]
    );

    console.log(`🔍 Checking if database '${res.rowCount}' exists...`);
    

    if (res.rowCount === 0) {
      await rootClient.query(`CREATE DATABASE ${DB_DATABASE}`);
      console.log(`📦 Base de datos '${DB_DATABASE}' creada`);
    } else {
      console.log(`🔍 Base de datos '${DB_DATABASE}' ya existe`);
    }

    await rootClient.end();

    const dbClient = new Client({
      connectionString: DB_URL,
      user: DB_USER,
      host: DB_HOST,
      database: DB_DATABASE,
      password: DB_PASSWORD,
      port: DB_PORT,
    });

    await dbClient.connect();

    const sqlFilePath = path.join(__dirname, 'schema.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf8');

    await dbClient.query(sql);
    console.log('🎉 Esquema creado exitosamente');

    await dbClient.end();
    console.log('🚪 Conexión cerrada');
    
  } catch (error) {
    console.error('❌ Database initialization failed:');
    console.error(error);
    process.exit(1);
  }
};

run();