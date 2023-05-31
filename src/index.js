import express from "express";
import ProductRouter from "./router/productRouter.js";
import CartRouter from "./router/cartsRoutes.js"

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded ({extended: true }));

app.use("/api/products", ProductRouter)
app.use("api/cart", CartRouter )

app.listen(PORT , () => {
console.log(`Servidor Express puerto ${PORT}`);
});