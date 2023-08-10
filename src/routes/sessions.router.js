import { Router } from 'express';
import { passportCall } from '../utils/utils.js';
import cookieParser from 'cookie-parser';
import sessionController from '../controllers/sessions.controller.js';

const router = Router();

router.use(cookieParser(process.env.AUTH_SECRET));

router.post('/register', passportCall('register'), sessionController.register);

router.post('/login', passportCall('login', { session: false }), sessionController.login);

router.post('/resetpassword', passportCall('resetPassword'), sessionController.resetPassword);

router.post('/logout', sessionController.logout);

router.get('/github', passportCall('github', { scope: ['user:email'] }), sessionController.github);

router.get('/githubcallback', passportCall('github'), sessionController.githubCallback);

router.get('/currentuser', passportCall('jwt', { session: false }), sessionController.currentUser);

export default router;