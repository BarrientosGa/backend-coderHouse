import express from 'express'
import routerProducts from './routes/products.router.js';
import routerCarts from'./routes/carts.router.js';
import __dirname from './utils.js'
import handlebars from 'express-handlebars';
import routerSession from './routes/session.router.js'
import routerMockingProducts from './routes/mockingProducts.router.js'
import viewsRoutes from './routes/views.routes.js'
import routerUsers from './routes/users.router.js'
import cookieParser from "cookie-parser";
import { initializePassportJWT } from "./config/jwt.passport.js";
import initializePassport from './config/passport.config.js';
import MongoSingleton from './persistence/mongooseSingleton.js';
import config from './config/config.js'
import { errorMiddleware } from './middlewares/errors/error.middleware.js';
import { addLogger } from './utils/logger.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express'

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
const swaggerOptions = {
    definition: {
        openapi : '3.0.1',
        info: {
            title : 'Documentacion',
            description : 'Descripcion de api'
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
}
const specs  = swaggerJSDoc(swaggerOptions);
app.use('/apidocs' , swaggerUiExpress.serve , swaggerUiExpress.setup(specs))
app.use(addLogger)
app.use(express.static(__dirname+'/public'))
app.engine('handlebars',handlebars.engine());
app.set('views',__dirname+'/views')
app.use(cookieParser())
app.use(errorMiddleware)
initializePassportJWT()
initializePassport()

app.set('view engine','handlebars');
app.use('/', viewsRoutes)
app.use('/api/products/', routerProducts)
app.use('/api/carts/' , routerCarts)
app.use('/api/sessions' , routerSession)
app.use('/api/users' , routerUsers)
app.use('/mockingproducts' , routerMockingProducts)




app.listen(config.port , () => {
    console.log(`Conectado al puerto ${config.port}`);
})

//connection db
MongoSingleton.getInstance()