import express from 'express'
import routerProducts from './routes/products.router.js';
import routerCarts from'./routes/carts.router.js';
import routerWebSockets from './routes/webSockets.router.js'
import __dirname from './utils.js'
import mongoose from 'mongoose';
import handlebars from 'express-handlebars';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import routerSession from './routes/session.router.js'
import viewsRoutes from './routes/views.routes.js'
import passport from 'passport';
import cookieParser from "cookie-parser";
import { initializePassportJWT } from "./config/jwt.passport.js";
import initializePassport from './config/passport.config.js';


const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname+'/public'))
app.engine('handlebars',handlebars.engine());
app.set('views',__dirname+'/views')
app.use(cookieParser())
initializePassportJWT()
initializePassport()


/* app.use(
  session({
    store: new MongoStore({
      mongoUrl:
        "mongodb+srv://barrientosga22:40916271Gaby@cluster0.csihdak.mongodb.net/ecommerce?retryWrites=true&w=majority",
    }),
    secret: "mongoSecret",
    resave: true, //se mantiene la session en caso de que la sesion se mantenga inactiva. si es false deja de existir al pasar un tiempo
    saveUninitialized: false, //al estar en false si el objeto session llega vacio no se va guardar
  })
); */

/* initializePassport()
app.use(passport.initialize())
app.use(passport.session()) */
app.set('view engine','handlebars');
app.use('/', viewsRoutes)
app.use('/api/products/', routerProducts)
app.use('/api/carts/' , routerCarts)
app.use('/api/sessions' , routerSession)
app.use('/realtimeproducts' , routerWebSockets)




app.listen(8080 , () => {
    console.log('Conectado al puerto 8080');
})


mongoose.connect('mongodb+srv://barrientosga22:40916271Gaby@cluster0.csihdak.mongodb.net/ecommerce?retryWrites=true&w=majority')