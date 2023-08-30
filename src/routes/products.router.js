import { Router } from "express";
import uploader from '../utils/multer.js';
import { authorization } from '../utils/utils.js'
import productController from '../controllers/products.controller.js';
import EnumErrors from '../utils/errorHandler/enum.js';
import CustomError from '../utils/errorHandler/CustomError.js';

const router = Router();

router.get('/', authorization(['admin', 'user']), productController.getProducts);

router.get('/mockingproducts', authorization(['admin', 'user']), productController.getMockingProducts);

router.get('/:productId', authorization(['admin', 'user']), productController.getProductById);

router.post('/', authorization('admin'), uploader.array('thumbnails'), productController.addProduct);

router.put('/:productId', authorization('admin'), productController.updateProductById);

router.delete('/:productId', authorization('admin'), productController.deleteProductById);

//handler for invalid routes
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