import express from 'express'
import controller  from '../controllers/event.controller';


const router = express.Router();

router.get('/', controller.getEvents)

router.get('/event', controller.getEvent)

router.post('/event', controller.addEvent)

router.put('/event', controller.updateEvent)

router.delete('/event', controller.deleteEvent)

router.delete('/', controller.deleteEvents)

export default router
