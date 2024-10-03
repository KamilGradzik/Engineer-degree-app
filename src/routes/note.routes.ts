import controller  from '../controllers/note.controller'
import express from 'express'
import noteController from '../controllers/note.controller';

const router = express.Router();

router.get("/",controller.getNotes)

router.post("/", controller.addNote)

router.put("/", controller.updateNote)

router.delete("/", controller.deleteNotes)

export default router