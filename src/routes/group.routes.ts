import express from 'express'
import controller from '../controllers/group.controller'

const router = express.Router()

router.get("/", controller.getGroups)

router.get("/students", controller.getStudents)

router.get("/students/marks", controller.getStudentMarks)

router.get("/subjects", controller.getSubjects)

router.post("/", controller.addGroup)

router.post("/students", controller.addStudent)

router.post("/subjects", controller.addSubject)

router.post("/students/marks", controller.addMark)

router.put("/", controller.updateGroup)

router.put("/students", controller.updateStudent)

router.put("/subjects", controller.updateSubject)

router.put("/students/marks", controller.updateMark)

router.delete("/", controller.deleteGroups)

router.delete('/students', controller.deleteStudents)

router.delete('/subjects', controller.deleteDetachSubjects)

router.delete('/students/marks', controller.deleteMarks)

export default router