import express from 'express'
import routerProducts from './routes/products.router.js';
import routerCarts from'./routes/carts.router.js';
import routerWebSockets from './routes/webSockets.router.js'
import __dirname from './utils.js'
import handlebars from 'express-handlebars';
import MongoStore from 'connect-mongo';
import routerSession from './routes/session.router.js'
import viewsRoutes from './routes/views.routes.js'
import cookieParser from "cookie-parser";
import { initializePassportJWT } from "./config/jwt.passport.js";
import initializePassport from './config/passport.config.js';
import MongoSingleton from './persistence/mongooseSingleton.js';


const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname+'/public'))
app.engine('handlebars',handlebars.engine());
app.set('views',__dirname+'/views')
app.use(cookieParser())
initializePassportJWT()
initializePassport()

app.set('view engine','handlebars');
app.use('/', viewsRoutes)
app.use('/api/products/', routerProducts)
app.use('/api/carts/' , routerCarts)
app.use('/api/sessions' , routerSession)
/* app.use('/realtimeproducts' , routerWebSockets) */




app.listen(8080 , () => {
    console.log('Conectado al puerto 8080');
})

//connection db
MongoSingleton.getInstance()