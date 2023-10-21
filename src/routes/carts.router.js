import { Router } from "express";
import { addProductInCart, addProductInCartById, deleteProductInCartById, deleteProductsInCartById, getCartById, getCartsById, updateStockProductInCartById, updateCartWithArrayProducts } from "../services/carts.service.js";
import { validationNumber } from "../controllers/carts.controller.js";
import passport from 'passport'
import { rolesMiddlwaresUser } from "./middlewares/roles.middlewares.js";
import { verificarPertenenciaCarrito } from "./middlewares/carts.middlewares.js";

const router = Router()

//crea un nuevo carrito con productos
router.post('/', async (req, res) => {
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

//devuelve el carrito cid
router.get('/:cid', async (req, res) => {
    const { cid } = req.params

    try {
        const cart = await getCartById(cid)
        res.send(cart)
    } catch (error) {
        res.status(400).send({ status: 'Rejected', payload: error.message });
    }

})

//agrega al carrito cid el producto pid
router.post('/:cid/product/:pid', passport.authenticate('jwt', { session: false }), rolesMiddlwaresUser, verificarPertenenciaCarrito, async (req, res) => {
    const { cid, pid } = req.params
    try {
        await addProductInCartById(cid, pid)
        res.send({ message: 'Se agrego producto correctamente a carrito' })
    } catch (error) {
        res.status(400).send({ status: 'Rejected', payload: error.message });
    }

})

//Elimina del carrito cid el producto pid
router.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params
    try {
        await deleteProductInCartById(cid, pid)
        res.send({ message: 'Se elimino correctamente' })
    } catch (error) {
        res.status(400).send({ status: 'Rejected', payload: error.message });
    }
})

//actualiza el carrito cid con un array de productos
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

//actualizada la cantidad de ejemplares del producto pid del carrito cid
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

//elimina todos los productos del carrito cid
router.delete('/:cid', async (req, res) => {
    const { cid } = req.params
    try {
        await deleteProductsInCartById(cid)
        res.send({ message: 'Se limpio correctamente el carrito' })
    } catch (error) {
        res.status(400).send({ status: 'Rejected', payload: error.message });
    }
})

export default router