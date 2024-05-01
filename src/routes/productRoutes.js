const express = require('express');
const router = express.Router();
const ProductManager = require('./src/ProductManager');
const productManager = new ProductManager('./data/productos.json');

// Ruta para obtener todos los productos o limitarlos según el parámetro de consulta ?limit=
router.get('/', async (req, res) => {
    try {
        const limit = req.query.limit;
        let products = await productManager.getProducts();
        if (limit) {
            products = products.slice(0, parseInt(limit));
        }
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

// Ruta para obtener un producto por su ID
router.get('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid); 
        const product = await productManager.getProductById(productId); 
        if (product) {
            res.json(product); 
        } else {
            res.status(404).json({ error: 'Producto no encontrado' }); 
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto por ID' }); 
    }
});

// Ruta para agregar un nuevo producto
router.post('/', async (req, res) => {
    try {
        const newProductData = req.body; 
        await productManager.addProduct(newProductData); 
        res.status(201).json({ message: 'Producto agregado correctamente' }); 
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar el producto' }); 
    }
});

// Ruta para actualizar un producto por su ID
router.put('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid); 
        const updatedProductData = req.body; 
        await productManager.updateProduct(productId, updatedProductData); 
        res.json({ message: 'Producto actualizado correctamente' }); 
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});

// Ruta para eliminar un producto por su ID
router.delete('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid); 
        await productManager.deleteProduct(productId); 
        res.json({ message: 'Producto eliminado correctamente' }); 
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' }); 
    }
});

module.exports = router;

