import { promises as fs } from 'fs';
import { nanoid } from 'nanoid';
import ProductManager from './ProductManager';

const productAll = new ProductManager

class CartManager {
    constructor() {
        this.path = "./src/models/carts.json"
    }

    readCarts = async () => {
        let carts = await fs.readFile(this.path, "utf-8")
        return JSON.parse(carts);
    }

    writeCarts = async (carts) => {
        await fs.writeFile(this.path, JSON.stringify(carts));

    };

    exists = async (id) => {
        let carts = await this.readCarts()
        return carts.find(cart => cart.id === id)
    };

    addCarts = async () => {
        let cartsOld = await this.readCarts();
        let id = nanoid()
        let cartsConcat = [{ id: id, products: [] }, ...cartsOld]
        await this.writeCarts(cartsConcat)
        return "carrito agregado"
    }

    getcartsById = async (id) => {
        let cartById = await this.exists(id);
        if (!cartById) return "Producto no encontrado"
        return cartById
    };

    addProductInCart = async (cartId, productId) => {
        let cartById = await this.exists(cartId);
        if (!cartById) return "carrito no encontrado"
        let productById = await productAll.exists(productId)
        if (!cartById) return "producto no encontrado"
        
                let cartsAll = await this.readCarts();
                let cartFilter = cartsAll.filter((cart) => cart.id != cartId)

        if (cartById.products.some(prod => prod.id === productId)){
            let moreProductInCart = cartById.products.find(prod => prod.id === productId)
            moreProductInCart.cantidad ++
            console.log(moreProductInCart.cantidad)
            let cartsConcat = [productInCart, ...cartFilter]
            await this.writeCarts(cartsConcat)
            return "producto sumado al carrito"
    
        }

        cartById.products.push({ id: productById.id, cantidad: 1 })

        let cartsConcat = [cartById, ...cartFilter]
        await this.writeCarts(cartsConcat)
        return "producto agregado al carrito"

    }
};

export default CartManager;