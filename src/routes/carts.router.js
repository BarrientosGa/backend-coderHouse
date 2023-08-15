import { Router } from "express";
import { addProductInCart, addProductInCartById, deleteProductInCartById, deleteProductsInCartById, getCartById, getCartsById, updateStockProductInCartById, updateCartWithArrayProducts } from "../services/carts.service.js";
import { validationType } from "../controllers/products.controller.js";
import { validationNumber } from "../controllers/carts.controller.js";
import passport from 'passport'
import { rolesMiddlwaresUser } from "./middlewares/roles.middlewares.js";
import { verificarPertenenciaCarrito } from "./middlewares/carts.middlewares.js";
import { cartModel } from "../persistence/models/cart.model.js";
import { productModel } from "../persistence/models/product.model.js";
import ticketModel from "../persistence/models/ticket.model.js";
import { v4 as uuidv4 } from 'uuid';

const router = Router()

//crea un nuevo carrito con productos
router.post('/', validationType, async (req, res) => {
    const { products } = req.body
    const cart = {
        products
    }

    try {
        await addProductInCart(cart)
        res.send({ message: 'Se agrego el carrito correctamente' })
    } catch (error) {
        res.status(400).send({ status: 'Rejected', payload: error.message });
    }

})

//renderiza los productos de dicho carrito
router.get('/carts/:cid', async (req, res) => {
    const { cid } = req.params
    const cart = await getCartsById(cid)
    res.render('cart', cart)
})

router.get('/:cid', async (req, res) => {
    const { cid } = req.params

    try {
        const cart = await getCartById(cid)
        res.send(cart)
    } catch (error) {
        res.status(400).send({ status: 'Rejected', payload: error.message });
    }

})

router.post('/:cid/product/:pid', passport.authenticate('jwt', { session: false }), rolesMiddlwaresUser, verificarPertenenciaCarrito, async (req, res) => {
    const { cid, pid } = req.params
    try {
        await addProductInCartById(cid, pid)
        res.send({ message: 'Se agrego producto correctamente a carrito' })
    } catch (error) {
        res.status(400).send({ status: 'Rejected', payload: error.message });
    }

})

router.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params
    try {
        await deleteProductInCartById(cid, pid)
        res.send({ message: 'Se elimino correctamente' })
    } catch (error) {
        res.status(400).send({ status: 'Rejected', payload: error.message });
    }
})

router.put('/:cid', async (req, res) => {
    const { cid } = req.params
    const { products } = req.body
    try {
        await updateCartWithArrayProducts(cid, products)
        res.send({ message: 'Se agrego correctamente los productos al carrito' })
    } catch (error) {
        res.status(400).send({ status: 'Rejected', payload: error.message });
    }

})

router.put('/:cid/products/:pid', validationNumber, async (req, res) => {
    const { cid, pid } = req.params
    const { stock } = req.body
    try {
        await updateStockProductInCartById(cid, pid, stock)
        res.send({ message: 'Se agrego correctamente el stock del producto' })
    } catch (error) {
        res.status(400).send({ status: 'Rejected', payload: error.message });
    }
})

router.delete('/:cid', async (req, res) => {
    const { cid } = req.params
    try {
        await deleteProductsInCartById(cid)
        res.send({ message: 'Se limpio correctamente el carrito' })
    } catch (error) {
        res.status(400).send({ status: 'Rejected', payload: error.message });
    }
})

router.get('/:cid/purchase', async (req, res) => {
    const { cid } = req.params
    const cart = await cartModel.findOne({ _id: cid })
    let totalPurchase = 0
   
    const prueba = cart.products.map(async ({product}) => {
        let totalPurchase = 0
        const arrayProductsWithStock = []
        const arrayProductsWithoutStock = []
        const productTest = await productModel.findOne({ _id: product })
        if (productTest.stock > 0) {
            totalPurchase = totalPurchase + productTest.price;
            arrayProductsWithStock.push(productTest._id);
              return {
                totalPurchase,
                arrayProductsWithStock
              } 
        }
        else {
            totalPurchase = 0
            arrayProductsWithoutStock.push(productTest._id)
            return {
                totalPurchase,
                arrayProductsWithoutStock
            }
        }
      
    })

    console.log('total purchase' , totalPurchase);


    /*   const ticket = {
        code : uuidv4(),
        purchase_datetime : new Date(),
        products : [...arrayProductsWithStock],
        amount : totalPurchase,
        purchaser : 'gaby.0097@hotmail.com'
    }
    
    await ticketModel.create(ticket) */

    res.end();
})

export default router