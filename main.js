class ProductManager {
    constructor() {
        this.products = []
    }

    static id = 0

    addProduct(title, description, price, image, code, stock) {

        for (let i = 0; i < this.products.length; i++) {
            if (this.products[i].code === code) {
                return alert(`El codigo ${code} esta repetido`);
            }
        }

        const newProduct = {
            title,
            description,
            price,
            image,
            code,
            stock,

        }
        if (!Object.values(newProduct).includes(undefined)) {

            ProductManager.id++;
            this.products.push({
                ...newProduct,
                id: ProductManager.id
            });
        } else {
            return alert("todos los campos son requeridos!")
        }
    }

    getProduct() {
        return this.products;
    }

    existe(id) {
        return this.products.find((producto) => producto.id === id);
    }

    getProductById(id) {

        !this.existe(id) ? alert("Not Found") : alert(this.existe(id));
    }
}

const productos = new ProductManager();

// 1) arreglo vacio
productos.getProduct()

// productos agregados
productos.addProduct('titulo1', 'descripcion1', '1000', 'imagen1', 'abc123', 5);
productos.addProduct('titulo2', 'descripcion2', '1000', 'imagen2', 'abc124');

// 2) productos
productos.getProduct();

// codigo repetido
productos.addProduct('titulo3', 'descripcion3', '1000', 'imagen2', 'abc124', 7);

// busco el producto por su id
productos.getProductById(2);

// id no encontrado
productos.getProductById(8);