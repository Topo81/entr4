const path = require('path');
const fs = require('fs').promises;
const handlebars = require('express-handlebars');
const viewsRouter = require('./src/routes/views.router.js');
const { Server } = require('socket.io');

const PORT = 8080;
const express = require('express')
const app = express();
const server = require('http').createServer(app);
const httpServer = app.listen(PORT, console.log(`Server running on port ${PORT}`))
const io = new Server(httpServer);
const socketServer = new Server(httpServer)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(viewsRouter)



// Configurar Handlebars como el motor de plantillas
app.engine('handlebars', handlebars.engine({layoutsDir: path.join(__dirname, 'views')
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

const productRoutes = require('./src/routes/productRoutes.js');
const cartRoutes = require('./src/routes/cartRoutes.js');
app.use('/products', productRoutes);
app.use('/carts', cartRoutes);

socketServer.on('connection', socket=> {
    console.log("nuevo cliente conectado")
})

// Leer el archivo JSON de productos
async function readProducts() {
    try {
        const data = await fs.readFile('./data/productos.json', 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error al leer el archivo de productos:', error);
        return [];
    }
}

// Ruta para renderizar la vista home con los datos de los productos
app.get('/home', async (req, res) => {
    try {
        const products = await readProducts();
        res.render('home', { products: products });
    } catch (error) {
        console.error('Error al cargar los productos:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Ruta para renderizar la vista en tiempo real de los productos
app.get('/realTimeProducts', async (req, res) => {
    try {
        const products = await readProducts();
        res.render('realTimeProducts', { products: products });
    } catch (error) {
        console.error('Error al cargar los productos en tiempo real:', error);
        res.status(500).send('Error interno del servidor');
    }
});


// Configurar WebSocket para la vista de productos en tiempo real
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    // Evento para emitir la lista de productos en tiempo real
    socket.on('getRealTimeProducts', async () => {
        const products = await readProducts();
        io.emit('realTimeProducts', products);
    });
});





