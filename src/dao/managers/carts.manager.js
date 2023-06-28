import CartsModel from '../models/carts.model.js';
import ProductsModel from '../models/products.model.js';

class CartManager {
  constructor() {
    this.cartModel = CartsModel;
    this.productModel = ProductsModel;
  }

  createCart = async () => {
    try {
      const newCart = await this.cartModel.create({ products: [] });
      return newCart;
    } catch (error) {
      throw new Error(`Failed to add cart: ${error.message}`);
    }
  }

  getCart = async (cartId) => {
    try {
      const cart = await this.cartModel.findById(cartId);
      if (!cart) {
        throw new Error('Cart not found');
      }
      return cart;
    } catch (error) {
      throw new Error(`Failed to retrieve cart: ${error.message}`);
    }
  }

  addToCart = async (cartId, productId) => {
    try {
      const cart = await this.cartModel.findById(cartId);
      if (!cart) {
        throw new Error('Cart not found');
      }
      if (!productId) {
        throw new Error('Product ID is required');
      }
      const product = await this.productModel.findById(productId);
      if (!product) {
        throw new Error('Product not found');
      }
      const existingProduct = cart.products.find((product) => product.productId === productId);
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cart.products.push({ productId: productId, quantity: 1 });
      }
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error(`Failed to add product to cart: ${error.message}`);
    }
  }

  removeFromCart = async (cartId, productId) => {
    try {
      const cart = await this.cartModel.findById(cartId);
      if (!cart) {
        throw new Error('Cart not found');
      }
      if (!productId) {
        throw new Error('Product ID is required');
      }
      const existingProduct = cart.products.find((product) => product.productId === productId);
      if (!existingProduct) {
        throw new Error('Product not found in cart');
      }
      existingProduct.quantity -= 1;
      if (existingProduct.quantity === 0) {
        cart.products = cart.products.filter((product) => product.productId !== productId);
      }
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error(`Failed to remove product from cart: ${error.message}`);
    }
  }

  updateProductQuantity = async (cartId, productId, quantity) => {
    try {
      const cart = await this.cartModel.findById(cartId);
      if (!cart) {
        throw new Error('Cart not found');
      }
      if (!productId) {
        throw new Error('Product ID is required');
      }
      const existingProduct = cart.products.find((product) => product.productId === productId);
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
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error(`Failed to update product quantity: ${error.message}`);
    }
  }

  emptyCart = async (cartId) => {
    try {
      const cart = await this.cartModel.findById(cartId);
      if (!cart) {
        throw new Error('Cart not found');
      }
      cart.products = [];
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error(`Failed to empty cart: ${error.message}`);
    }
  }

  deleteCart = async (cartId) => {
    try {
      const cart = await this.cartModel.findByIdAndDelete(cartId);
      if (!cart) {
        throw new Error('Cart not found');
      }
    } catch (error) {
      throw new Error(`Failed to delete cart: ${error.message}`);
    }
  }
}

export { CartManager };