import { Router } from "express";
import { authorization } from '../utils/utils.js'
import cartController from '../controllers/carts.controller.js';

const router = Router();

router.post('/', authorization(['admin', 'user']), cartController.createCart);

router.get('/:cartId', authorization(['admin', 'user']), cartController.getCartById);

router.put('/:cartId', authorization(['admin', 'user']), cartController.updateCartById);

router.post('/:cartId/products/:productId', authorization(['admin', 'user']), cartController.addProductToCart);

router.delete('/:cartId/products/:productId', authorization(['admin', 'user']), cartController.removeProductFromCart);

router.put('/:cartId/products/:productId', authorization(['admin', 'user']), cartController.updateProductQuantity);

router.delete('/:cartId', authorization(['admin', 'user']), cartController.emptyCart);

export default router;
