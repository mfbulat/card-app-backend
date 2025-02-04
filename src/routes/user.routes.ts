import { Router } from "express";
const router = Router();
import UserController from "../controllers/user.controller";

router.post("/user", UserController.createUser);
router.get("/user", UserController.getUsers);
router.get("/user/:id", UserController.getOneUser);
router.put("/user", UserController.updateUser);
router.delete("/user/:id", UserController.deleteUser);

export default router;
