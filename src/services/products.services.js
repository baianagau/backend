import { productsRepository } from '../repositories/index.js';

class ProductService {
    constructor() {
        this.productRepository = productsRepository;
    }

    getProducts = async (limit = 10, page = 1, sort, category, available, baseUrl) => {
        try {
            if (available) {
                const lowerAvailable = available.toLowerCase();
                if (lowerAvailable !== 'true' && lowerAvailable !== 'false') {
                    throw new Error('Invalid available value. true or false expected');
                }
            }
            if (sort) {
                const lowerSort = sort.toLowerCase();
                if (lowerSort !== 'asc' && lowerSort !== 'desc') {
                    throw new Error('Invalid sort value. asc or desc expected');
                }
            }
            if (category) {
                const trimmedCategory = category.trim();
                if (trimmedCategory.length === 0) {
                    throw new Error('Invalid category value. Non-empty string expected');
                }
            }
            if (limit) {
                const parsedLimit = parseInt(limit);
                if (isNaN(parsedLimit) || parsedLimit < 1) {
                    throw new Error('Invalid limit value. Positive integer expected');
                }
            }
            if (page) {
                const parsedPage = parseInt(page);
                if (isNaN(parsedPage) || parsedPage < 1) {
                    throw new Error('Invalid page value. Positive integer expected');
                }
            }
            if (baseUrl) {
                if (typeof baseUrl !== 'string' || baseUrl.length === 0) {
                    throw new Error('Invalid baseUrl value. Non-empty string expected');
                }
            }

            const products = await this.productRepository.getProducts(limit, page, sort, category, available);

            // Build navigation links
            let navLinks = {};

            if (baseUrl) {
                const sortOptions = ['asc', 'desc'];
                const availableOptions = ['true', 'false'];
                const sortQuery = sort && sortOptions.includes(sort.toLowerCase()) ? `&sort=${sort}` : '';
                const categoryQuery = category ? `&category=${encodeURIComponent(category)}` : '';
                const availableQuery = available && availableOptions.includes(available.toLowerCase()) ? `&available=${available}` : '';
                navLinks = {
                    firstLink: products.totalPages > 1 ? `${baseUrl}?limit=${limit}&page=1${sortQuery}${categoryQuery}${availableQuery}` : null,
                    prevLink: products.hasPrevPage ? `${baseUrl}?limit=${limit}&page=${products.prevPage}${sortQuery}${categoryQuery}${availableQuery}` : null,
                    nextLink: products.hasNextPage ? `${baseUrl}?limit=${limit}&page=${products.nextPage}${sortQuery}${categoryQuery}${availableQuery}` : null,
                    lastLink: products.totalPages > 1 ? `${baseUrl}?limit=${limit}&page=${products.totalPages}${sortQuery}${categoryQuery}${availableQuery}` : null
                };
            }
            const productsWithLinks = { ...products, ...navLinks };
            return productsWithLinks;
        } catch (error) {
            throw error;
        }
    };

    getProductById = async (productId) => {
        try {
            const product = await this.productRepository.getProductById(productId);
            if (!product) {
                throw new Error('Product not found');
            }
            return product;
        } catch (error) {
            throw error;
        }
    };

    productFieldsValidation = async (product) => {
        try {
            const allowedFields = ['title', 'description', 'code', 'price', 'stock', 'category', 'thumbnails'];
            const receivedFields = Object.keys(product);
            const isValidOperation = receivedFields.every((field) => allowedFields.includes(field));
            if (!isValidOperation) {
                throw new Error('Invalid fields!');
            }
            const productWithSameCode = await this.productRepository.getProductByCode(product.code);
            if (productWithSameCode) {
                throw new Error('Product with same code already exists');
            }
            if (product.price) {
                const parsedPrice = parseFloat(product.price);
                if (isNaN(parsedPrice) || parsedPrice < 0) {
                    throw new Error('Invalid price value. Positive number expected');
                }
            }
            if (product.stock) {
                const parsedStock = parseInt(product.stock);
                if (isNaN(parsedStock) || parsedStock < 0) {
                    throw new Error('Invalid stock value. Positive integer expected');
                }
            }
            if ('category' in product) {
                const trimmedCategory = product.category.trim();
                if (typeof trimmedCategory !== 'string') {
                    throw new Error('Invalid category value. String expected');
                }
                if (trimmedCategory.length === 0) {
                    throw new Error('Invalid category value. Non-empty string expected');
                }
            }
        } catch (error) {
            throw error;
        }
    };

    addProduct = async (newProductFields) => {
        try {
            await this.productFieldsValidation(newProductFields);
            return await this.productRepository.addProduct(newProductFields);
        } catch (error) {
            throw error;
        }
    };

    updateProduct = async (productId, updatedProductFields) => {
        try {
            await this.productFieldsValidation(updatedProductFields);
            const product = await this.productRepository.getProductById(productId);
            if (!product) {
                throw new Error('Product not found');
            }
            return await this.productRepository.updateProduct(productId, updatedProductFields);
        } catch (error) {
            throw error;
        }
    };

    deleteProduct = async (productId) => {
        try {
            const product = await this.productRepository.getProductById(productId);
            if (!product) {
                throw new Error('Product not found');
            }
            return await this.productRepository.deleteProduct(productId);
        } catch (error) {
            throw error;
        }
    };

    getProductStock = async (productId) => {
        try {
            const product = await this.productRepository.getProductById(productId);
            if (!product) {
                throw new Error('Product not found');
            }
            return product.stock;
        } catch (error) {
            throw error;
        }
    };

    updateProductStock = async (productId, quantity) => {
        try {
            if (!quantity ) {
                throw new Error('Invalid quantity');
            }
            const product = await this.productRepository.getProductById(productId);
            if (!product) {
                throw new Error('Product not found');
            }
            const newStock = product.stock + quantity;
            if (newStock < 0) {
                throw new Error('Not enough stock');
            }
            return await this.productRepository.updateProduct(productId, { stock: newStock });
        } catch (error) {
            throw error;
        }
    };

}

export { ProductService }