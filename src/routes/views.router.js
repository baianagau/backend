import { Router } from "express";
import { jwtVerify, tokenFromCookieExtractor } from '../utils/utils.js';
import cookieParser from 'cookie-parser';
import viewsController from "../controllers/views.controller.js";

const router = Router();
router.use(cookieParser(process.env.AUTH_SECRET));

const publicAccess = (req, res, next) => {
    const token = tokenFromCookieExtractor(req);
    if (token && jwtVerify(token)) {
        return res.redirect('/products');
    }
    next();
};

const privateAccess = (req, res, next) => {
    const token = tokenFromCookieExtractor(req);
    const decodedToken = jwtVerify(token);
    if (token && decodedToken) {
        req.user = decodedToken.user;
        return next();
    }
    res.redirect('/login');
};

router.get('/register', publicAccess, viewsController.register);

router.get('/login', publicAccess, viewsController.login);

router.get('/resetpassword', publicAccess, viewsController.resetPassword);

router.get('/', privateAccess, viewsController.userProfile);

router.get('/staticProducts', privateAccess, viewsController.staticProducts);

router.get('/realtimeproducts', privateAccess, viewsController.realTimeProducts);

router.get('/webchat', privateAccess, viewsController.webchat);

router.get('/products', privateAccess, viewsController.products);

router.get('/carts/:cartId', privateAccess, viewsController.carts);

export default router;