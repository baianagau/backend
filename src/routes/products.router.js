import { Router } from "express";
import uploader from '../utils/multer.js';
import { authorization } from '../utils/utils.js'
import productController from '../controllers/products.controller.js';

const router = Router();

router.get('/', authorization(['admin', 'user']), productController.getProducts);

router.get('/:productId', authorization(['admin', 'user']), productController.getProductById);

router.post('/', authorization('admin'), uploader.array('thumbnails'), productController.addProduct);

router.put('/:productId', authorization('admin'), productController.updateProductById);

router.delete('/:productId', authorization('admin'), productController.deleteProductById);

export default router;
