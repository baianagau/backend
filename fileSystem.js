const fs = require ("fs");


class ProductManager {
    constructor(){
        this.patch ="./productos.txt";
        this.products =[];
    }

    static id = 0;

    addProduct = async (title, description, price, image, code, stock ) => {
        
        ProductManager.id++ ;

let newProduct ={
    title,
    description,
    price,
    image,
    code,
    stock,
    id: ProductManager.id
};
this.products.push(newProduct);


        await fs.promises.writeFile(this.patch, JSON.stringify(this.products));
    };


    readProducts = async()=>{
        let respuesta = await fs.promises.readFile(this.patch, "utf-8")
        return JSON.parse(respuesta)

    }

    getProducts = async ()=> {
        let respuesta2 = await this.readProducts()
      return  console.log( respuesta2)
        
        };

getProductsById = async(id) =>{
    let respuesta3 = await this.readProducts()
if (!respuesta3.find(product => product.id === id)){
    console.log ("producto no encontrado")
}else {
    console.log ( respuesta3.find(product => product.id === id));
}


};

deleteProductsById =async (id)=> {
    let respuesta3 = await this.readProducts();
    let productFilter = respuesta3.filter(products => products.id != id)
 await fs.promises.writeFile(this.patch, JSON.stringify(productFilter));
 console.log("producto eliminado")
};

updateProducts = async ({ id, ...producto}) => {
await this.deleteProductsById(id);
let productOld = await this.readProducts();

let modifiedProducts =[{ ... producto, id },...productOld,];
await fs.promises.writeFile(this.patch, JSON.stringify(modifiedProducts));
};

}
const productos = new ProductManager();

// productos.addProduct("Titulo1", "Description1", 1000, "image1", "abc123", 5);
// productos.addProduct("Titulo2", "Description2", 3000, "image2", "abc123", 6);
// productos.addProduct("Titulo3", "Description3", 4000, "image3", "abc123", 7);

productos.getProducts();

// productos.getProductsById(3)
// productos.deleteProductsById(2);

productos.updateProducts ({
    title: 'Titulo3',
    description: 'Description3',
    price: 3500,
    image: 'image3',
    code: 'abc125',
    stock: 22,
    id: 3
})

