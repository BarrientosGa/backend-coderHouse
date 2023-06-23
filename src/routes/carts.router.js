import { Router } from "express";
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises'
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

















export default router