import db from "../db";

class PostController {
  async createPost(req: any, res: any) {
    try {
      const { title, content, userId } = req.body;
      const newPost = await db.query(
        "INSERT INTO post (title, content, user_id) values ($1, $2, $3) RETURNING *",
        [title, content, userId],
      );
      res.json(newPost.rows[0]);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  async getPostsByUser(req: any, res: any) {
    try {
      const id = req.query.id;
      const posts = await db.query("SELECT * FROM post WHERE user_id = $1", [
        id,
      ]);
      res.json(posts.rows[0]);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}

export default new PostController();
