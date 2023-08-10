import { productsUpdated } from "../utils/socketUtils.js";
import { ProductService } from "../services/products.services.js";

const productService = new ProductService();

const getProducts = async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, category, available } = req.query;
        // Get baseUrl for navigation links
        const baseUrl = `${req.protocol}://${req.get('host')}${req.originalUrl.split('?')[0]}`;
        const products = await productService.getProducts(limit, page, sort, category, available, baseUrl);
        res.send({ status: 1, ...products });
    } catch (error) {
        res.status(500).send({ status: 0, msg: error.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const productId = req.params.productId;
        const product = await productService.getProductById(productId)
        res.send({ status: 1, product: product });
    } catch (error) {
        res.status(404).send({ status: 0, msg: error.message });
    }
};

const addProduct = async (req, res) => {
    try {
        const newProductFields = req.body;
        const files = req.files;
        const filesUrls = files.map(file => `http://localhost:8080/files/uploads/${file.filename}`);
        if (filesUrls.length > 0) {
            newProductFields.thumbnails = filesUrls;
        } else {
            newProductFields.thumbnails = [];
        }
        const newProduct = await productService.addProduct(newProductFields);
        productsUpdated(req.app.get('io'));
        res.send({ status: 1, msg: 'Product added successfully', product: newProduct });
    } catch (error) {
        res.status(500).send({ status: 0, msg: error.message });
    }
};

const updateProductById = async (req, res) => {
    try {
        const productId = req.params.productId;
        const updatedProductFields = req.body;

        if (Object.keys(req.body).length === 0) throw new Error('Empty request body');
        const updatedProduct = await productService.updateProduct(productId, updatedProductFields);
        productsUpdated(req.app.get('io'));
        res.send({ status: 1, msg: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
        res.status(404).send({ status: 0, msg: error.message });
    }
};

const deleteProductById = async (req, res) => {
    try {
        const productId = req.params.productId;
        await productService.deleteProduct(productId);
        productsUpdated(req.app.get('io'));
        res.send({ status: 1, msg: 'Product deleted successfully' });
    } catch (error) {
        res.status(404).send({ status: 0, msg: error.message });
    }
};

export default {
    getProducts,
    getProductById,
    addProduct,
    updateProductById,
    deleteProductById
};
