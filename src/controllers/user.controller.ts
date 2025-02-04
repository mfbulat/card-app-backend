import db from "../db";
import bcrypt from "bcrypt";

class UserController {
  async createUser(req: any, res: any) {
    try {
      const { name, surname, email, password } = req.body;

      // Validate inputs
      if (!name || !surname || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
      }

      // Check if the email already exists
      const emailCheck = await db.query(
        "SELECT id FROM users WHERE email = $1",
        [email],
      );
      if (emailCheck.rows.length > 0) {
        return res.status(400).json({ error: "Email already in use" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

      // Insert the new user into the database
      const newPerson = await db.query(
        "INSERT INTO users (name, surname, email, password) VALUES ($1, $2, $3, $4) RETURNING id, name, surname, email, created_at",
        [name, surname, email, hashedPassword],
      );

      // Return the new user (excluding the password)
      res.status(201).json(newPerson.rows[0]);
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ error: "An error occurred while creating the user" });
    }
  }

  async getUsers(req: any, res: any) {
    try {
      // Pagination parameters (default: page 1, limit 10)
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;

      // Fetch users with pagination
      const users = await db.query(
        "SELECT id, name, surname, email, created_at FROM users ORDER BY id LIMIT $1 OFFSET $2",
        [limit, offset],
      );

      // Get the total number of users for pagination metadata
      const totalUsers = await db.query("SELECT COUNT(*) FROM users");
      const totalCount = parseInt(totalUsers.rows[0].count, 10);

      // Return the users with pagination metadata
      res.json({
        data: users.rows,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit),
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "An error occurred while fetching users" });
    }
  }

  async getOneUser(req: any, res: any) {
    try {
      const id = req.params.id;

      // Validate the ID
      if (!id || isNaN(Number(id))) {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      // Fetch the user (excluding the password)
      const user = await db.query(
        "SELECT id, name, surname, email, created_at FROM users WHERE id = $1",
        [id],
      );

      // Check if the user exists
      if (user.rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      // Return the user
      res.json(user.rows[0]);
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ error: "An error occurred while fetching the user" });
    }
  }

  async updateUser(req: any, res: any) {
    try {
      const { id, name, surname, email, password, currentPassword } = req.body;

      // Validate inputs
      if (!id || !name || !surname || !email || !password || !currentPassword) {
        return res.status(400).json({ error: "All fields are required" });
      }

      // Fetch the user's current data
      const userResult = await db.query("SELECT * FROM users WHERE id = $1", [
        id,
      ]);
      const user = userResult.rows[0];

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Verify the current password
      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password,
      );
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid current password" });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Check if the new email already exists
      const emailCheck = await db.query(
        "SELECT id FROM users WHERE email = $1 AND id != $2",
        [email, id],
      );
      if (emailCheck.rows.length > 0) {
        return res.status(400).json({ error: "Email already in use" });
      }

      // Update the user
      const updatedUser = await db.query(
        "UPDATE users SET name = $1, surname = $2, email = $3, password = $4 WHERE id = $5 RETURNING id, name, surname, email, created_at",
        [name, surname, email, hashedPassword, id],
      );

      // Return the updated user (excluding the password)
      res.json(updatedUser.rows[0]);
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ error: "An error occurred while updating the user" });
    }
  }

  async deleteUser(req: any, res: any) {
    try {
      const id = req.params.id;

      // Validate the ID
      if (!id || isNaN(Number(id))) {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      // Check if the user exists
      const userResult = await db.query("SELECT id FROM users WHERE id = $1", [
        id,
      ]);
      if (userResult.rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      // Delete the user
      await db.query("DELETE FROM users WHERE id = $1", [id]);

      // Return success message
      res.json({ message: "User deleted successfully" });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ error: "An error occurred while deleting the user" });
    }
  }
}

export default new UserController();
