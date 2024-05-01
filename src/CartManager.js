const fs = require('fs').promises;

class CartManager {
    constructor(filePath) {
        this.filePath = filePath;
    }

    async createCart(cartData) {
        try {
            // Leer los datos actuales de los carritos desde el archivo
            const carts = await this.readCarts();
            // Generar un nuevo ID para el carrito
            const newCartId = Math.floor(Math.random() * 1000) + 1;
            // Crear el nuevo carrito con el ID generado y los datos proporcionados
            const newCart = {
                id: newCartId,
                products: cartData.products || []
            };
            // Agregar el nuevo carrito a la lista de carritos
            carts.push(newCart);
            // Escribir los carritos actualizados en el archivo
            await this.writeCarts(carts);
        } catch (error) {
            throw new Error('Error al crear el carrito');
        }
    }

    async getCartProducts(cartId) {
        try {
            // Leer los datos actuales de los carritos desde el archivo
            const carts = await this.readCarts();
            // Buscar el carrito por su ID
            const cart = carts.find(cart => cart.id === cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
            // Devolver los productos del carrito encontrado
            return cart.products;
        } catch (error) {
            throw new Error('Error al obtener los productos del carrito');
        }
    }

    async addProductToCart(cartId, productId, quantity) {
        try {
            // Leer los datos actuales de los carritos desde el archivo
            const carts = await this.readCarts();
            // Buscar el carrito por su ID
            const cart = carts.find(cart => cart.id === cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
            // Agregar el producto al carrito
            cart.products.push({ productId, quantity });
            // Escribir los carritos actualizados en el archivo
            await this.writeCarts(carts);
        } catch (error) {
            throw new Error('Error al agregar el producto al carrito');
        }
    }

    async readCarts() {
        try {
            // Leer y parsear los datos de los carritos desde el archivo
            const data = await fs.readFile(this.filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            // Si ocurre un error, devolver un array vacío
            return [];
        }
    }

    async writeCarts(carts) {
        try {
            // Convertir los carritos a formato JSON y escribirlos en el archivo
            await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2));
        } catch (error) {
            throw new Error('Error al escribir en el archivo de carritos');
        }
    }
}

module.exports = CartManager;
