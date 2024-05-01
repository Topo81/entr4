const express = require('express');
const router = express.Router();
const CartManager = require('../CartManager');

// Crear una instancia de CartManager
const cartManager = new CartManager('./data/carts.json');

// Ruta para crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
        const newCartData = req.body; // Obtener los datos del nuevo carrito del cuerpo de la solicitud
        await cartManager.createCart(newCartData); // Crear el nuevo carrito
        res.status(201).json({ message: 'Carrito creado correctamente' }); // Enviar una respuesta de éxito
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el carrito' }); // Manejar errores
    }
});

// Ruta para obtener los productos de un carrito por su ID
router.get('/:cid', async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid);
        const cart = await cartManager.getCartById(cartId);
        if (!cart) {
            res.status(404).json({ error: 'Carrito no encontrado' });
        } else {
            res.json(cart);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el carrito por ID' });
    }
});

// Ruta para agregar un producto a un carrito por su ID
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid);
        const productId = parseInt(req.params.pid);
        const productQuantity = req.body.quantity;
        await cartManager.addProductToCart(cartId, productId, productQuantity);
        res.status(201).json({ message: 'Producto agregado al carrito correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar el producto al carrito' });
    }
});

module.exports = router;
