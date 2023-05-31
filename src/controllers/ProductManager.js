import { promises as fs } from 'fs';
import { nanoid } from 'nanoid';


class ProductManager {
    constructor() {
        this.path = "./src/models/products.json"
    }

    readProducts = async () => {
        let products = await fs.readFile(this.path, "utf-8")
        return JSON.parse(products);
    }

    writeProducts = async (product) => {
        await fs.writeFile(this.path, JSON.stringify(product));

    };



    exists = async (id) => {
        let products = await this.readProducts()
        return products.find(prod => prod.id === id)
    };

    addProducts = async (product) => {
        console.log(product,"p")
        let productOld = await this.readProducts();
        product.id = nanoid()
        let productAll = [...productOld, product];
        await this.writeProducts(productAll);
        return "producto agregado ";
    };
    getProducts = async () => {
        return await this.readProducts()
    };

    getProductById = async (id) => {

        let productById = await this.exists(id);
        if (!productById) return "Producto no encontrado"
        return productById
    };


    updateProducts = async (id, product) => {

        let productById = await this.exists(id)
        if (!productById) return "Producto no encontrado"
        await this.deleteProducts(id)
        let productOld = await this.readProducts()
        let products = [{ product, id: id }, ...productOld]
        await this.writeProducts(products)
        return "Producto actualizado"
    };

    deleteProducts = async (id) => {
        let products = await this.readProducts();
        let existsProducts = products.some(prod => prod.id === id)
        if (existsProducts) {
            let filterProducts = products.filter(prod => prod.id != id)
            await this.writeProducts(filterProducts)
            return "Producto eliminado"
        }
        return "el produscto a eliminar no existe "
    }
};
export default ProductManager;



