import { Router } from 'express';
import { authorization } from '../utils/utils.js';
import { bronxLogger } from '../utils/logger.js';

const router = Router();

router.get('/loggerTest', authorization(['admin']), (req, res) => {
    bronxLogger('debug', 'This is a debug test log');
    bronxLogger('http', 'This is a http test log');
    bronxLogger('info', 'This is a info test log');
    bronxLogger('warning', 'This is a warning test log');
    bronxLogger('error', 'This is an error test log');
    bronxLogger('fatal', 'This is a fatal test log');
    res.send('logger test');
});

export default router;