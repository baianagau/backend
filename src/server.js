import express from "express";
import ProductManager from "./components/ProductManager.js";

// creacion
const app = express()
app.use(express.urlencoded({ extended: true }));

const productos = new ProductManager()
const readProducts = productos.readProducts()

// console.log(await readProducts);

// consulta al servidor
app.get("/products", async (req, res) => {

    // ruta 1. products?limit=num
    let limit = parseInt(req.query.limit);
    if (!limit) return res.send(await readProducts)

    let allProducts = await readProducts
    let productLimit = allProducts.slice(0, limit)
    res.send(productLimit);

});
// ruta 2  products/id
app.get("/products/:id", async (req, res) => {
    let id = parseInt(req.params.id);
    let allProducts = await readProducts;
    let productById = allProducts.find(product => product.id === id)
    res.send(productById)

});

const PORT = 8080;
const server = app.listen(PORT, () => {
    console.log(`Express por local host ${server.address().port}`)
})
server.on("error", (error) => console.log(`error del servidor${error}`))