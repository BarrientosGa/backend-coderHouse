import { Router } from "express";
import { cartModel } from "../dao/models/cart.model.js";
import {productModel} from '../dao/models/product.model.js'

const router = Router()

router.post('/' , async(req,res)=>{
    const {products} = req.body
    const cart = {
        products
    }

    try {
        await cartModel.create(cart)
        res.send({message: 'Se agrego el carrito correctamente'})
    } catch (error) {
        res.status(400).send({ status: 'Rejected', payload: error.message });
    }
   
})

router.get('/:cid' , async(req,res)=>{
    const {cid} = req.params
   
    try {
        const cart = await cartModel.findOne({_id : cid}).populate()
        if (cart) {
            return res.send(cart)
        } else {
            return res.send({message : 'El id no existe'})
        }
    } catch (error) {
        res.status(400).send({ status: 'Rejected', payload: error.message });
    }

})

router.post('/:cid/product/:pid' , async(req,res)=>{
    const {cid , pid} = req.params
    try {
        const product = await productModel.findOne({_id : pid})
        const cart = await cartModel.findOne({_id: cid})
        cart.products.push({product: product})
        cart.save()
        res.send({message : 'Se agrego producto correctamente a carrito'})
    } catch (error) {
        console.log(error);
    }   
    
})

router.delete('/:cid/products/:pid' , async(req,res) => {
    //Debera eliminar del carrito id el producto seleccionado
    const {cid , pid} = req.params
    try {
        const cart = await cartModel.findOne({_id: cid})
        //elimino un producto del carrito con el pull
        cart.products.pull(pid)
        await cart.save()
        res.send({message:'Se elimino correctamente'})
    } catch (error) {
        console.log(error);   
    }
})

router.put('/:cid' , async(req,res) => {
    //deberá actualizar el carrito con un arreglo de productos con el formato especificado arriba.
    const {cid} = req.params
    const {products} = req.body
    try {
        const cart = await cartModel.findOne({_id: cid})
        cart.products=[...products]
        await cart.save()
        res.send({message:'Se agrego correctamente los productos al carrito'})
    } catch (error) {
        console.log(error);
    }
   
})

router.put('/:cid/products/:pid' , async(req,res) => {
    //deberá poder actualizar SÓLO la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body
    const {cid , pid} = req.params
    const {stock} = req.body
    try {
        const product = await productModel.findOne({_id : pid})
        const cart = await cartModel.findOne({_id : cid})
        product.stock = stock
        await product.save()
        await cart.save()
        res.send({message:'Se agrego correctamente el stock del producto'})
    } catch (error) {
        console.log(error);
    }   
})

router.delete('/:cid' , async(req,res) => {
    //Vacia los productos de ese carrito
    const {cid} = req.params
    try {
        const cart = await cartModel.findOne({_id: cid})
        cart.products=[]
        await cart.save()
        res.send({message:'Se limpio correctamente el carrito'})
    } catch (error) {
        console.log(error);
    }
})

export default router