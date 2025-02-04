import Router from "express";
const router = Router();
import postController from "../controllers/post.controller";

router.post("/post", postController.createPost);
router.get("/post", postController.getPostsByUser);

export default router;
