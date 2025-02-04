import { Router } from "express";
const router = Router();
import PersonController from "../controllers/person.controller";

router.post("/person", PersonController.createPerson);
router.get("/person", PersonController.getPerson);
router.get("/person/:id", PersonController.getOnePerson);
router.put("/person", PersonController.updatePerson);
router.delete("/person/:id", PersonController.deletePerson);

export default router;
