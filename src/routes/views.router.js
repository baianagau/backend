import { Router } from "express";
import { ProductManager } from '../dao/managers/products.manager.js';
import { CartManager } from '../dao/managers/carts.manager.js';
const router = Router();

// const publicAccess = (req, res, next) => {
//     if (req.session.user) return res.redirect('/products');
//     next();
// }
// const privateAccess = (req, res, next) => {
//     if (!req.session.user) return res.redirect('/login');
//     next();
// }
router.get('/', (req, res) => {
    if(req.session.users){
        res.redirect('/products')
    }else{
        res.redirect('/login')
    }
})

// router.get('/register', publicAccess, (req, res) => {
//     res.render('register', {title: 'Welcome!!', style: 'login.css'});
// })
router.get('/register', async(req, res) => {
    res.render('register', {title: 'Welcome!!', style: 'login.css'})
})


// router.get('/login', publicAccess, (req, res) => {
//     res.render('login', {title: 'Hello!', style: 'login.css'});
// })
router.get('/login', async(req, res) => {
    res.render('login', {title: 'Hello!', style: 'login.css'})
})
router.get('/resetpassword',async (req, res) => {
    res.render('resetPassword', {title: 'Hello! Lets recover your password', style: 'login.css'});
})


router.get('/staticProducts', async (req,res)=>{
    const productManager = new ProductManager();
    const products = await productManager.getProducts();
    res.render('home', {title: 'Bronx Products', style: 'product.css', products: products});
})

router.get('/realtimeproducts', async (req,res)=>{
    res.render('realTimeProducts', {title: 'Products', style: 'productList.css'});
})

router.get('/webchat', (req,res)=>{
    res.render('chat', { style: 'chat.css', title: 'Bronx Webchat'});
})

// router.get('/products', async (req,res)=>{
//     try {
//         const { limit = 10, page = 1, sort, category, available } = req.query;
//         // Get baseUrl for navigation links
//         const baseUrl = `${req.protocol}://${req.get('host')}${req.originalUrl.split('?')[0]}`;
//         const productManager = new ProductManager();
//         const products = await productManager.getProducts(limit, page, sort, category, available, baseUrl);
//         res.render('productList', {title: 'Bronx Products', style: 'productList.css', products: products, user: req.session.user});
//     } catch (error) {
//         res.status(500).send(error.message);
//     }
// })
router.get('/products', async (req, res) => {
    try{
        let user = ''
        if(req.session.users){
            user = req.session.users
        }else{
            res.redirect('/login')
        }

        if (req.query.page) {
            queryPage = parseInt(req.query.page);
            if (isNaN(queryPage) || queryPage < 1) {
                throw new Error('Invalid page number');
            }
        }

        let query = {}
        if(req.query.query === undefined){ // query undefined
            query = {}
        }else if(req.query.query === 'true'){ // status === true
            query.status = true
        }else if(req.query.query === 'false'){ // status === false
            query.status = false
        }else{ // category === req.query.params
            query.category = req.query.query
        }

        let sort = null
        if (req.query.sort === "asc") { // asc or desc
            sort = { price: 1 };
        } else if (req.query.sort === "desc") {
            sort = { price: -1 };
        }

        const options = {
            limit: req.query.limit ? parseInt(req.query.limit) : 10,
            page: req.query.page ? parseInt(req.query.page) : 1,
            sort: sort
        }

        const products = await productManager.getProducts(query, options)
        const { docs, totalPages, prevPage, nextPage, page, hasPrevPage, hasNextPage } = products
        
        let prevLink = ""
        let nextLink = ""

        if(query.status !== undefined){ // if query.status exists
            hasPrevPage === false ? prevLink = null : prevLink = `/products?page=${parseInt(prevPage)}&limit=${options.limit}&sort=${req.query.sort}&query=${query.status}`
            hasNextPage === false ? nextLink = null : nextLink = `/products?page=${parseInt(nextPage)}&limit=${options.limit}&sort=${req.query.sort}&query=${query.status}`
        }else if(query.category !== undefined){ // if query.category exists
            hasPrevPage === false ? prevLink = null : prevLink = `/products?page=${parseInt(prevPage)}&limit=${options.limit}&sort=${req.query.sort}&query=${query.category}`
            hasNextPage === false ? nextLink = null : nextLink = `/products?page=${parseInt(nextPage)}&limit=${options.limit}&sort=${req.query.sort}&query=${query.category}`
        }else{ // if there isn't query values
            hasPrevPage === false ? prevLink = null : prevLink = `/products?page=${parseInt(prevPage)}&limit=${options.limit}&sort=${req.query.sort}`
            hasNextPage === false ? nextLink = null : nextLink = `/products?page=${parseInt(nextPage)}&limit=${options.limit}&sort=${req.query.sort}`
        }
        res.render('products', {status: 'succes', payload: docs, totalPages, prevPage, nextPage, page, hasPrevPage, hasNextPage, prevLink, nextLink, session: user })
    }catch(error){
        res.render('products', {status: 'error', message: error.message})
    }
})

router.get('/carts/:cartId', async (req,res)=>{
    try {
        const cartId = req.params.cartId;
        const cartManager = new CartManager();
        const cart = await cartManager.getCart(cartId);
        res.render('cart', {title: 'Bronx', style: 'cart.css', cart: cart});
    } catch (error) {
        res.status(500).send(error.message);
    }
})

export default router;