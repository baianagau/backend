import { Router } from 'express';
import { authorization } from '../utils/utils.js'
import messageController from '../controllers/messages.controller.js';

const router = Router();

router.get('/', authorization(['admin', 'user']), messageController.getMessages);

router.post('/', authorization(['user']), messageController.postMessage);

export default router;