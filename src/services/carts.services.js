import e from 'connect-flash';
import { CartManager } from '../dao/managers/carts.manager.js';
import { ProductManager } from '../dao/managers/products.manager.js';

class CartService {

    constructor() {
        this.cartManager = new CartManager();
        this.productManager = new ProductManager();
    }

    createCart = async () => {
        try {
            const newCart = await this.cartManager.createCart();
            return newCart;
        } catch (error) {
            throw new Error(`Failed to add cart: ${error.message}`);
        }
    }

    getCart = async (cartId) => {
        try {
            const cart = await this.cartManager.getCartById(cartId);
            if (!cart) {
                throw new Error('Cart not found');
            }
            return cart;
        } catch (error) {
            throw error;
        }
    }

    checkProductStock = async (productId, quantity) => {
        try {
            const product = await this.productManager.getProductById(productId);
            if (!product) {
                throw new Error('Product not found');
            }
            if (product.stock < quantity) {
                throw new Error('Insufficient stock');
            }
        } catch (error) {
            throw error;
        }
    }

    addToCart = async (cartId, productId) => {
        try {
            let stockControl = 0;
            const cart = await this.cartManager.getCartById(cartId);
            if (!cart) {
                throw new Error('Cart not found');
            }
            if (!productId) {
                throw new Error('Product ID is required');
            }
            const product = await this.productManager.getProductById(productId);
            if (!product) {
                throw new Error('Product not found');
            }
            const existingProduct = cart.products.find((product) => product.product._id.toString() === productId);
            if (existingProduct) {
                existingProduct.quantity += 1;
                stockControl = existingProduct.quantity;
            } else {
                cart.products.push({ product: product, quantity: 1 })
                stockControl = 1;
            }
            await this.checkProductStock(productId, stockControl);
            await this.cartManager.updateCartProducts(cartId, cart.products);
            return cart;
        } catch (error) {
            throw error;
        }
    }

    removeFromCart = async (cartId, productId) => {
        try {
            const cart = await this.cartManager.getCartById(cartId);
            if (!cart) {
                throw new Error('Cart not found');
            }
            if (!productId) {
                throw new Error('Product ID is required');
            }
            const existingProduct = cart.products.find((product) => product.product._id.toString() === productId);
            if (!existingProduct) {
                throw new Error('Product not found in cart');
            }
            existingProduct.quantity -= 1;
            if (existingProduct.quantity === 0) {
                cart.products = cart.products.filter((product) => product.product._id.toString() !== productId);
            }
            await this.cartManager.updateCartProducts(cartId, cart.products);
            return cart;
        } catch (error) {
            throw error;
        }
    }

    updateProductQuantity = async (cartId, productId, quantity) => {
        try {
            const cart = await this.cartManager.getCartById(cartId);
            if (!cart) {
                throw new Error('Cart not found');
            }
            if (!productId) {
                throw new Error('Product ID is required');
            }
            const existingProduct = cart.products.find((product) => product.product._id.toString() === productId);
            if (!existingProduct) {
                throw new Error('Product not found in cart');
            }
            if (!quantity) {
                throw new Error('Quantity is required');
            }
            if (quantity <= 0) {
                throw new Error('Quantity cannot be zero or negative');
            }
            existingProduct.quantity = quantity;
            await this.cartManager.updateCartProducts(cartId, cart.products);
            return cart;
        } catch (error) {
            throw error;
        }
    }

    emptyCart = async (cartId) => {
        try {
            const cart = await this.cartManager.getCartById(cartId);
            if (!cart) {
                throw new Error('Cart not found');
            }
            cart.products = [];
            await this.cartManager.updateCartProducts(cartId, cart.products);
            return cart;
        } catch (error) {
            throw new Error(`Failed to empty cart: ${error.message}`);
        }
    }

    addProductsToCart = async (cartId, products) => {
        try {
            const cart = await this.cartManager.getCartById(cartId);
            if (!cart) {
                throw new Error('Cart not found');
            }
            if (!products || !Array.isArray(products) || products.length === 0) {
                throw new Error('Invalid product list');
            }
            const existingProducts = cart.products.map((product) => product.product._id.toString());
            const productsToAdd = [];
            const productsToUpdate = [];
            for (const productData of products) {
                const { productId, quantity } = productData;
                if (!productId) {
                    throw new Error('Product ID is required');
                }
                if (!quantity || quantity <= 0) {
                    throw new Error('Invalid quantity');
                }
                const product = await this.productManager.getProductById(productId);
                if (!product) {
                    throw new Error(`Product not found: ${productId}`);
                }
                if (existingProducts.includes(productId)) {
                    const existingProduct = cart.products.find((product) => product.product._id.toString() === productId);
                    existingProduct.quantity += quantity;
                    productsToUpdate.push(existingProduct);
                } else {
                    productsToAdd.push({ product: product, quantity: quantity });
                }
            }
            cart.products.push(...productsToAdd);
            await this.cartManager.updateCartProducts(cartId, cart.products);
            return cart;
        } catch (error) {
            throw new Error(`Failed to add products to cart: ${error.message}`);
        }
    }
}

export { CartService };