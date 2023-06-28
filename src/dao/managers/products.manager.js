import ProductsModel from '../models/products.model.js';

class ProductManager {
  constructor() {
    this.productsModel = ProductsModel;
  }

  getProducts = async (limit = null ) => {
    try {
      let query = this.productsModel.find();
      if (limit) {
        query = query.limit(parseInt(limit));
      }
      const products = await query.exec();
      return products;
    } catch (error) {
      throw new Error(`Failed to retrieve: ${error.message}`);
    }
  }

  addProduct = async (newFields) => {
    try {
      const newProduct = await this.productsModel.create(newFields);
      return newProduct;
    } catch (error) {
      throw new Error(`Failed to add product: ${error.message}`);
    }
  }

  getProductById = async (productId) => {
    try {
      const product = await this.productsModel.findById(productId);
      if (!product) {
        throw new Error('Product not found');
      }
      return product;
    } catch (error) {
      throw new Error(`Failed to retrieve product: ${error.message}`);
    }
  }

  deleteProduct = async (productId) => {
    try {
      const product = await this.productsModel.findByIdAndDelete(productId);
      if (!product) {
        throw new Error('Product not found');
      }
    } catch (error) {
      throw new Error(`Failed to delete product: ${error.message}`);
    }
  }

  updateProduct = async (productId, updatedFields) => {
    try {
      const { code, price, stock, thumbnails, ...otherFields } = updatedFields;

      if (code) {
        const existingProduct = await this.productsModel.findOne({ code: code });
        if (existingProduct && existingProduct._id.toString() !== productId) {
          throw new Error('The specified code is in use by another existing product');
        }
      }

      const updatedProduct = await this.productsModel.findByIdAndUpdate(
        productId,
        {
          $set: {
            ...otherFields,
            ...(code && { code }),
            ...(price && { price }),
            stock: stock !== undefined ? stock : 0,
            ...(thumbnails && { thumbnails }),
          },
        },
        { new: true, runValidators: true }
      );

      if (!updatedProduct) {
        throw new Error('Product not found');
      }
  
      return updatedProduct;

    } catch (error) {
      throw new Error(`Failed to update product: ${error.message}`);
    }
  }
}

export { ProductManager };
