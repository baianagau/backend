import { cartsRepository } from '../repositories/index.js';
import { ProductService } from './products.services.js';
import { TicketService } from './tickets.services.js';
class CartService {

    constructor() {
        this.cartRepository = cartsRepository;
        this.productService = new ProductService();
        this.ticketService = new TicketService();
    }

    createCart = async () => {
        try {
            const newCart = await this.cartRepository.createCart();
            return newCart;
        } catch (error) {
            throw new Error(`Failed to add cart: ${error.message}`);
        }
    }

    getCartById = async (cartId) => {
        try {
            const cart = await this.cartRepository.getCartById(cartId);
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
            const product = await this.productService.getProductById(productId);
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
            const cart = await this.cartRepository.getCartById(cartId);
            if (!cart) {
                throw new Error('Cart not found');
            }
            if (!productId) {
                throw new Error('Product ID is required');
            }
            const product = await this.productService.getProductById(productId);
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
            await this.cartRepository.updateCartProducts(cartId, cart.products);
            return cart;
        } catch (error) {
            throw error;
        }
    }

    removeFromCart = async (cartId, productId) => {
        try {
            const cart = await this.cartRepository.getCartById(cartId);
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
            await this.cartRepository.updateCartProducts(cartId, cart.products);
            return cart;
        } catch (error) {
            throw error;
        }
    }

    updateProductQuantity = async (cartId, productId, quantity) => {
        try {
            const cart = await this.cartRepository.getCartById(cartId);
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
            await this.cartRepository.updateCartProducts(cartId, cart.products);
            return cart;
        } catch (error) {
            throw error;
        }
    }

    emptyCart = async (cartId) => {
        try {
            const cart = await this.cartRepository.getCartById(cartId);
            if (!cart) {
                throw new Error('Cart not found');
            }
            cart.products = [];
            await this.cartRepository.updateCartProducts(cartId, cart.products);
            return cart;
        } catch (error) {
            throw new Error(`Failed to empty cart: ${error.message}`);
        }
    }

    addProductsToCart = async (cartId, products) => {
        try {
            const cart = await this.cartRepository.getCartById(cartId);
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
                const product = await this.productService.getProductById(productId);
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
            await this.cartRepository.updateCartProducts(cartId, cart.products);
            return cart;
        } catch (error) {
            throw new Error(`Failed to add products to cart: ${error.message}`);
        }
    }

    checkoutCart = async (cartId, purchaser) => {
        try {
            const cart = await this.cartRepository.getCartById(cartId);
            if (!cart) {
                throw new Error('Cart not found');
            }
            if (cart.products.length === 0) {
                throw new Error('Cart is empty');
            }
            const products = cart.products;

            const productsPurchased = [];
            const productsNotPurchased = [];

            for (const product of products) {
                try {
                    await this.productService.updateProductStock(product.product._id.toString(), -product.quantity);
                    productsPurchased.push(product);
                } catch (error) {
                    productsNotPurchased.push(product);
                }
            }

            if (productsPurchased.length === 0) {
                throw new Error('No products were purchased');
            }

            await this.emptyCart(cartId);
            if (productsNotPurchased.length > 0) {
                const newCartProducts = productsNotPurchased.map((product) => {
                    return { productId: product.product._id.toString(), quantity: product.quantity }
                });
                await this.addProductsToCart(cartId, newCartProducts);
            }
            const remainingCart = await this.getCartById(cartId);

            const totalAmount = productsPurchased.reduce((total, product) => total + (product.product.price * product.quantity), 0);
            const newTicket = await this.ticketService.createTicket({ amount: totalAmount, purchaser: purchaser });

            if (!newTicket) {
                throw new Error('Failed to create ticket');
            }

            const purchaseCartResult = {
                ticket: newTicket,
                productsPurchased: productsPurchased,
                productsNotPurchased: productsNotPurchased,
                remainingCart: remainingCart
            }

            return purchaseCartResult;
        } catch (error) {
            throw new Error(`Failed to purchase cart: ${error.message}`);
        }
    }
}

export { CartService };