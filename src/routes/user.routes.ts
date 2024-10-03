import express from 'express';
import controller from '../controllers/user.controller';

const router = express.Router();

router.post('/login', controller.loginUser)

router.post('/register', controller.registerUser)

export default router;