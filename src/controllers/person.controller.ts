import db from "../db";

class PersonController {
  async createPerson(req: any, res: any) {
    try {
      const { name, surname } = req.body;
      const newPerson = await db.query(
        "INSERT INTO person (name, surname) values ($1, $2) RETURNING *",
        [name, surname],
      );
      res.json(newPerson.rows[0]);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  async getPerson(req: any, res: any) {
    try {
      const users = await db.query("SELECT * FROM person");
      res.json(users.rows);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  async getOnePerson(req: any, res: any) {
    try {
      const id = req.params.id;
      const user = await db.query("SELECT * FROM person WHERE id = $1", [id]);
      res.json(user.rows[0]);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  async updatePerson(req: any, res: any) {
    try {
      const { id, name, surname } = req.body;
      const user = await db.query(
        "UPDATE person set name = $1, surname = $2 where id = $3 RETURNING *",
        [name, surname, id],
      );
      res.json(user.rows[0]);
    } catch (err) {
      res.status(500).json("err");
      console.log(err);
    }
  }

  async deletePerson(req: any, res: any) {
    try {
      const id = req.params.id;
      await db.query("DELETE FROM person WHERE id = $1", [id]);
      res.json("User deleted");
    } catch (err) {
      res.status(500).json(err);
    }
  }
}

export default new PersonController();
