import { InitialFormData } from "@/app/initialConfiguration/schema";
import { pool } from "./db";

export const getForumConfig = async () => {
  const client = await pool.connect();

  let config = {}

  try {
    const result = await client.query('SELECT * from forum_config');
    client.release();
    config = result.rows[0];
  } catch(error) {
    console.error('Error connection');
    throw error
  }

  return config;
}

export const setForumConfig = async (newConfig: InitialFormData) => {
  const { name, description, admin_email, lang, theme } = newConfig;
  const client = await pool.connect();

  try {
    const result = await client.query(`INSERT INTO forum_config (
        forum_name,
        forum_description,
        forum_admin_email,
        forum_lang,
        forum_theme
      )
      VALUES (
        '${name}',
        '${description}',
        '${admin_email}',
        '${lang}',
        '${theme}'
      )`);

    console.log('result', result)
  } catch(error) {
    console.error('Error connection');
    throw error
  }
}