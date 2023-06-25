import express from 'express'
import routerProducts from './routes/products.router.js';
import routerCarts from'./routes/carts.router.js';
import routerWebSockets from './routes/webSockets.router.js'
import __dirname from './utils.js'
import mongoose from 'mongoose';
import handlebars from 'express-handlebars';

const app = express()
app.engine('handlebars',handlebars.engine());
app.set('views',__dirname+'/views')
app.set('view engine','handlebars');
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/api/products/' , routerProducts)
app.use('/api/carts/' , routerCarts)
app.use('/realtimeproducts' , routerWebSockets)


app.listen(8080 , () => {
    console.log('Conectado al puerto 8080');
})


mongoose.connect('mongodb+srv://barrientosga22:40916271Gaby@cluster0.csihdak.mongodb.net/ecommerce?retryWrites=true&w=majority')