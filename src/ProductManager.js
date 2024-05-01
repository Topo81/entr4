const fs = require('fs');

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
    }

    async addProduct(datosProducto) {
        try {
            let products = await this.readProducts();
    
            const newProductId = products.length > 0? products[products.length - 1].id + 1 : 1;

            const newProduct = {
                id: newProductId,
                title: datosProducto.title,
                description: datosProducto.description,
                price: datosProducto.price,
                thumbnail: datosProducto.thumbnail,
                code: datosProducto.code,
                stock: datosProducto.stock
            };

            products.push(newProduct);

            await this.writeProducts(products);

            console.log("Listo! Producto agregado correctamente");
        } catch (error) {
            console.error("Error al agregar el producto:", error);
        }
    }

    async getProducts() {
        try {
            const products = await this.readProducts();
            return products;
        } catch (error) {
            console.error("Error al obtener los productos:", error);
            return [];
        }
    }

    async getProductById(productId) {
        try {
            const products = await this.readProducts();
            const product = products.find(product => product.id === productId);
            if (!product) {
                console.log("Producto no encontrado");
                return null;
            }
            return product;
        } catch (error) {
            console.error("Error al obtener el producto por ID:", error);
            return null;
        }
    }

    async updateProduct(productId, updatedFields) {
        try {
            let products = await this.readProducts();
            const index = products.findIndex(product => product.id === productId);
            if (index === -1) {
                console.log("Producto no encontrado");
                return;
            }
            products[index] = {...products[index],...updatedFields };
            await this.writeProducts(products);
            console.log("Producto actualizado correctamente");
        } catch (error) {
            console.error("Error al actualizar el producto:", error);
        }
    }

    async deleteProduct(productId) {
        try {
            let products = await this.readProducts();
            products = products.filter(product => product.id!== productId);
            await this.writeProducts(products);
            console.log("Producto eliminado correctamente");
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
        }
    }

    async readProducts() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            if (error.code === 'error') {
                console.log("El archivo de productos no existe. Se creará uno nuevo.");
                return [];
            }
            console.error("Error al leer el archivo de productos:", error);
            return [];
        }
    }

    async writeProducts(products) {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
        } catch (error) {
            console.error("Error al escribir en el archivo de productos:", error);
        }
    }
}

module.exports = ProductManager;