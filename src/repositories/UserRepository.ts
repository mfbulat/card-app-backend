import { pool } from "../db";

class UserRepository {
  async createUser(
    name: string,
    surname: string,
    email: string,
    password: string,
  ) {
    const result = await pool.query(
      "INSERT INTO users (name, surname, email, password) VALUES ($1, $2, $3, $4) RETURNING id, name, surname, email, created_at",
      [name, surname, email, password],
    );
    return result.rows[0];
  }

  async getUsers(limit: number, offset: number) {
    const users = await pool.query(
      "SELECT id, name, surname, email, created_at FROM users ORDER BY id LIMIT $1 OFFSET $2",
      [limit, offset],
    );
    return users.rows;
  }

  async getTotalUsers() {
    const result = await pool.query("SELECT COUNT(*) FROM users");
    return parseInt(result.rows[0].count, 10);
  }

  async getUserById(id: number) {
    const user = await pool.query(
      "SELECT id, name, surname, email, created_at FROM users WHERE id = $1",
      [id],
    );
    return user.rows[0];
  }

  async getUserByEmail(email: string) {
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return user.rows[0];
  }

  async updateUser(
    id: number,
    name: string,
    surname: string,
    email: string,
    password: string,
  ) {
    const result = await pool.query(
      "UPDATE users SET name = $1, surname = $2, email = $3, password = $4 WHERE id = $5 RETURNING id, name, surname, email, created_at",
      [name, surname, email, password, id],
    );
    return result.rows[0];
  }

  async deleteUser(id: number) {
    await pool.query("DELETE FROM users WHERE id = $1", [id]);
  }
}

export default new UserRepository();
