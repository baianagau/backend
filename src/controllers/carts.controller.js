import { CartService } from "../services/carts.services.js";

const cartService = new CartService();

const createCart = async (req, res) => {
    try {
        const newCart = await cartService.createCart();
        res.status(201).send({ status: 1, msg: 'Cart added successfully', cartId: newCart._id });
    } catch (error) {
        res.status(500).send({ status: 0, msg: error.message });
    }
};

const getCartById = async (req, res) => {
    try {
        const cartId = req.params.cartId;
        const cart = await cartService.getCart(cartId);
        res.json({ status: 1, cart });
    } catch (error) {
        res.status(500).json({ status: 0, error: error.message });
    }
};

const updateCartById = async (req, res) => {
    try {
        const cartId = req.params.cartId;
        const products = req.body.products;
        const cart = await cartService.addProductsToCart(cartId, products)
        res.status(201).send({ status: 1, msg: 'Cart updated successfully', cartProducts: cart.products });
    } catch (error) {
        res.status(500).send({ status: 0, msg: error.message });
    }
};

const addProductToCart = async (req, res) => {
    try {
        const cartId = req.params.cartId;
        const productId = req.params.productId;
        const cart = await cartService.addToCart(cartId, productId);
        res.status(201).send({ status: 1, msg: 'Product added to cart successfully', cart });
    } catch (error) {
        res.status(500).send({ status: 0, msg: error.message });
    }
};

const removeProductFromCart = async (req, res) => {
    try {
        const cartId = req.params.cartId;
        const productId = req.params.productId;
        const cart = await cartService.removeFromCart(cartId, productId);
        res.status(201).send({ status: 1, msg: 'Product deleted from cart successfully', cart });
    } catch (error) {
        res.status(500).send({ status: 0, msg: error.message });
    }
};

const updateProductQuantity = async (req, res) => {
    try {
        const cartId = req.params.cartId;
        const productId = req.params.productId;
        const quantity = req.body.quantity;
        const cart = await cartService.updateProductQuantity(cartId, productId, quantity);
        res.status(201).send({ status: 1, msg: 'Product quantity updated successfully', cart });
    } catch (error) {
        res.status(500).send({ status: 0, msg: error.message });
    }
};

const emptyCart = async (req, res) => {
    const cartId = req.params.cartId;

    try {
        const emptiedCart = await cartService.emptyCart(cartId);
        res.status(201).send({ status: 1, msg: 'Cart successfully emptied', cart: emptiedCart });
    } catch (error) {
        res.status(500).json({ status: 0, error: error.message });
    }
};

export default {
    createCart,
    getCartById,
    updateCartById,
    addProductToCart,
    removeProductFromCart,
    updateProductQuantity,
    emptyCart
};
