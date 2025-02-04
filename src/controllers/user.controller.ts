import { Request, Response } from "express";
import UserService from "../services/UserService";
import { errorManage } from "../utils/fetch";

class UserController {
  async createUser(req: Request, res: Response) {
    try {
      const { name, surname, email, password } = req.body;
      const user = await UserService.createUser(name, surname, email, password);
      res.status(201).json(user);
    } catch (err) {
      errorManage(err, res, 500);
    }
  }

  async getUsers(req: Request, res: Response) {
    try {
      const page = parseInt(req?.query?.page as string) || 1;
      const limit = parseInt(req?.query?.limit as string) || 10;
      const result = await UserService.getUsers(page, limit);
      res.json(result);
    } catch (err) {
      errorManage(err, res, 500);
    }
  }

  async getOneUser(req: any, res: any) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }
      const user = await UserService.getUserById(id);
      res.json(user);
    } catch (err) {
      errorManage(err, res, 400);
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const { id, name, surname, email, password, currentPassword } = req.body;
      const user = await UserService.updateUser(
        id,
        name,
        surname,
        email,
        password,
        currentPassword,
      );
      res.json(user);
    } catch (err) {
      errorManage(err, res, 400);
    }
  }

  async deleteUser(req: any, res: any) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }
      await UserService.deleteUser(id);
      res.json({ message: "User deleted successfully" });
    } catch (err) {
      errorManage(err, res, 404);
    }
  }
}

export default new UserController();
