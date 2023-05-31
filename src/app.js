import express from 'express'
import routerProducts from './routes/products.router.js';
import routerCarts from'./routes/carts.router.js';
import routerWebSockets from './routes/webSockets.router.js'
import handlebars from 'express-handlebars'
import __dirname from './utils.js'
import ProductManager from "./ProductManager.js";
import fs from 'fs/promises'
import {Server} from 'socket.io'

const app = express()
const httpServer = app.listen(8080, () => console.log('Conectado al puerto 8080'))
export const socketServer = new Server(httpServer)
const manejadorDeProductos = new ProductManager();
const dataInFile = await fs.readFile(manejadorDeProductos.path , 'utf-8')
const products = JSON.parse(dataInFile)
app.engine('handlebars' , handlebars.engine())
app.set('views' , __dirname+'/views')
app.set('view engine' , 'handlebars')
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname+'/public'))

app.use('/api/products/' , routerProducts)
app.use('/api/carts/' , routerCarts)
app.use('/realtimeproducts' , routerWebSockets)
app.get('/' , (req , res) => {
    
    res.render('home' , {
        products
    })
})

app.post('/realtimeproducts' , (req , res) => {
    const {title} = req.body
    const product = {
        title
    }
    socketServer.emit('prueba' , product)
    res.send({message: 'todo ok'})
})

socketServer.on('connection' , socket => {
    console.log('Nuevo cliente conectado');
})
