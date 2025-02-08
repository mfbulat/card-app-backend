import { Pool } from "pg";
import {
  createCardsTable,
  createDecksTable,
  createPersonTable,
  createPostsTable,
  createUsersTable,
} from "./tables";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const initializeDatabase = async () => {
  const client = await pool.connect();
  try {
    await Promise.all([
      client.query(createUsersTable),
      client.query(createPostsTable),
      client.query(createCardsTable),
      client.query(createDecksTable),
      client.query(createPersonTable),
    ]);
    console.log("Tables ensured.");
  } catch (err) {
    console.error("Error initializing database:", err);
  } finally {
    client.release();
  }
};

export { pool, initializeDatabase };
