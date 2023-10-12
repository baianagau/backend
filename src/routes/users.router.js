import { Router } from 'express';
import { authorization } from '../utils/utils.js'
import { checkDocumentUploader } from '../config/middlewares.config.js';
import cookieParser from 'cookie-parser';
import usersController from '../controllers/users.controller.js';
import EnumErrors from '../utils/errorHandler/enum.js';
import CustomError from '../utils/errorHandler/CustomError.js';
import uploader from '../utils/multer.js';

const router = Router();

router.use(cookieParser(process.env.AUTH_SECRET));

router.put('/:email/premium', authorization('admin'), usersController.togglePremiumFeature);

router.post('/:email/documents', authorization(['user', 'premium']), checkDocumentUploader, uploader('documents').array('documents'), usersController.updateDocuments);

//cont de rutas inv
router.all('*', (req, res) => {
    CustomError.createError({
        name: 'Routing Error',
        message: 'Invalid route',
        type: EnumErrors.ROUTING_ERROR.type,
        recievedParams: { route: req.originalUrl },
        statusCode: EnumErrors.ROUTING_ERROR.statusCode
    });    
});

export default router;