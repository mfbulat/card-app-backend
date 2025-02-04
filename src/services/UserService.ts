// src/services/UserService.ts
import bcrypt from "bcrypt";
import UserRepository from "../repositories/UserRepository";

class UserService {
  async createUser(
    name: string,
    surname: string,
    email: string,
    password: string,
  ) {
    // Check if the email already exists
    const existingUser = await UserRepository.getUserByEmail(email);
    if (existingUser) {
      throw new Error("Email already in use");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    return UserRepository.createUser(name, surname, email, hashedPassword);
  }

  async getUsers(page: number, limit: number) {
    const offset = (page - 1) * limit;
    const users = await UserRepository.getUsers(limit, offset);
    const totalCount = await UserRepository.getTotalUsers();
    return {
      data: users,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  }

  async getUserById(id: number) {
    const user = await UserRepository.getUserById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async updateUser(
    id: number,
    name: string,
    surname: string,
    email: string,
    password: string,
    currentPassword: string,
  ) {
    const user = await UserRepository.getUserByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }

    // Verify the current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new Error("Invalid current password");
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user
    return UserRepository.updateUser(id, name, surname, email, hashedPassword);
  }

  async deleteUser(id: number) {
    const user = await UserRepository.getUserById(id);
    if (!user) {
      throw new Error("User not found");
    }
    await UserRepository.deleteUser(id);
  }
}

export default new UserService();
