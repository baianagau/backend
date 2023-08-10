import { Router } from 'express';
import messageController from '../controllers/messages.controller.js';

const router = Router();

router.get('/', messageController.getMessages);

router.post('/', messageController.postMessage);

export default router;