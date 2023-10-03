import { createHash } from "../utils/utils.js";

const testUserPassword = 'test';
const testUser = {
    firstName: 'Test',
    lastName: 'Test',
    email: 'test@bronx.com',
    birthDate: '',
    password: createHash(testUserPassword),
    role: 'user'
};

const newUserPassword = 'new';
const newUser = {
    firstName: 'New',
    lastName: 'User',
    email: 'new@bronx.com',
    birthDate: '',
    password: createHash(newUserPassword),
    role: 'user'
};

const testProduct = {
    title: 'Test Product',
    description: 'Test Product Description',
    code: 'TESTPRODUCTCODE',
    price: 10,
    stock: 10,
    category: 'Test Category'
};

const newProduct = {
    title: 'New Product',
    description: 'New Product Description',
    code: 'NEWPRODUCTCODE',
    price: 10,
    stock: 10,
    category: 'New Category',
    image: ''
};

export { testUser, newUser, testUserPassword, testProduct, newProduct };