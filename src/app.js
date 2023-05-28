import express from 'express'
import routerProducts from './routes/products.router.js';
import routerCarts from'./routes/carts.router.js';
import handlebars from 'express-handlebars'
import __dirname from './utils.js'
import ProductManager from "./ProductManager.js";
import fs from 'fs/promises'

const app = express()
const manejadorDeProductos = new ProductManager();
const dataInFile = await fs.readFile(manejadorDeProductos.path , 'utf-8')
const products = JSON.parse(dataInFile)
app.engine('handlebars' , handlebars.engine())
app.set('views' , __dirname+'/views')
app.set('view engine' , 'handlebars')
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/api/products/' , routerProducts)
app.use('/api/carts/' , routerCarts)
app.get('/' , (req , res) => {
    
    res.render('home' , {
        products
    })
})

app.listen(8080 , () => {
    console.log('Conectado al puerto 8080');
})