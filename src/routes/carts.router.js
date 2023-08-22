import { Router } from "express";
import { authorization } from '../utils/utils.js'
import cartController from '../controllers/carts.controller.js';

const router = Router();

router.post('/', authorization(['user']), cartController.createCart);

router.get('/:cartId', authorization(['admin', 'user']), cartController.getCartById);

router.put('/:cartId', authorization(['user']), cartController.updateCartById);

router.post('/:cartId/products/:productId', authorization(['user']), cartController.addProductToCart);

router.delete('/:cartId/products/:productId', authorization(['user']), cartController.removeProductFromCart);

router.put('/:cartId/products/:productId', authorization(['user']), cartController.updateProductQuantity);

router.delete('/:cartId', authorization(['user']), cartController.emptyCart);

router.post('/:cartId/checkout', authorization(['user']), cartController.checkoutCart);

export default router;