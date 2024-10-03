import express  from "express";
import controller from "../controllers/schedule.controller";

const router = express.Router()

router.get('/', controller.getShedules)

router.get('/schedule', controller.getSchedule)

router.post('/schedule', controller.attachGroup)

router.delete('/schedule', controller.detachGroup)

router.post('/', controller.addSchedule)

router.put('/', controller.updateSchedule)

router.delete('/', controller.deleteSchedules)



export default router