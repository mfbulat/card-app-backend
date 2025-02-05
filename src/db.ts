import { Pool } from "pg";

//connectionString: postgres://username:password@host:port/database

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;
