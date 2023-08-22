import CartsModel from '../models/carts.model.js';
import ProductsModel from '../models/products.model.js';

class CartMongoManager {
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

  getCartById = async (cartId) => {
    try {
      const cart = await this.cartModel.findById(cartId).lean();
      return cart;
    } catch (error) {
      throw new Error(`Failed to retrieve cart: ${error.message}`);
    }
  }

  updateCartProducts = async (cartId, newCartProducts) => {
    try {
      const cart = await this.cartModel.findById(cartId);
      if (!newCartProducts) {
        throw new Error('Cart products are required');
      }
      cart.products = newCartProducts;
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error(`Failed to add product to cart: ${error.message}`);
    }
  }
}

export default CartMongoManager;