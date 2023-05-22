import fs from "fs";


export default class ProductManager {
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




// productos.addProduct("Titulo1", "Description1", 1000, "image1", "abc1", 1);
// productos.addProduct("Titulo2", "Description2", 1000, "image2", "abc2", 2);
// productos.addProduct("Titulo3", "Description3", 1000, "image3", "abc3", 3);
// productos.addProduct("Titulo4", "Description4", 1000, "image4", "abc4", 4);
// productos.addProduct("Titulo5", "Description5", 1000, "image5", "abc5", 5);
// productos.addProduct("Titulo6", "Description6", 1000, "image6", "abc6", 6);
// productos.addProduct("Titulo7", "Description7", 1000, "image7", "abc7", 7);
// productos.addProduct("Titulo8", "Description8", 1000, "image8", "abc8", 8);
// productos.addProduct("Titulo9", "Description9", 3000, "image9", "abc9", 9);
// productos.addProduct("Titulo10", "Description10",4000, "image10", "abc10", 10);

// productos.getProducts();

// productos.getProductsById(3)
// productos.deleteProductsById(2);

productos.updateProducts ({
    title: 'Titulo3',
    description: 'Description3',
    price: 3500,
    image: 'image3',
    code: 'abc3',
    stock: 22,
    id: 3
});

