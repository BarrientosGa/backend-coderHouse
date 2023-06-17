import { Router } from "express";
import fs from 'fs/promises'
import ProductManager from "../ProductManager.js";
import { v4 as uuidv4 } from 'uuid';
import {productModel} from '../dao/models/product.model.js'

const router = Router()
const manejadorDeProductos = new ProductManager();

router.get('/' , async(req,res)=>{
    const {limit} =req.query
    try {
        const products = await productModel.find().limit(limit)
        res.send({products})
    } catch (error) {
       res.send({message : 'Hubo un error en el servidor'}) 
    }
})


router.get('/:pid' , async(req,res)=>{
    const {pid} = req.params
    try {
        const product = await productModel.findOne({_id:pid})
        res.send(product)
    } catch (error) {
        res.send({message : 'El producto no existe'})
    }
})

router.post('/' , async(req , res) => {
    const {title , description, code, price , status=true , stock, category , thumbnails} = req.body
    const product = {
        title,
        description,
        code,
        price,
        status,
        stock,
        category
    }

    //if(findFieldUndefined === -1 && findProductWithCodeEqual === -1){
        product.thumbnails = thumbnails
        await productModel.create(product)
        res.send({message: 'Se agrego producto con exito'})
    //}
    //else {
        //res.status(400).send({message: 'No paso las validaciones'})
    //}
})

router.put('/:pid' , async(req,res)=>{
    const {pid} = req.params
    const fieldUpdate = req.body

    try {
        await productModel.updateOne({_id:pid} , fieldUpdate)
        res.status(201).send({message:'Producto actualizado con exito'})
    } catch (error) {
        console.log(error);
        res.status(500).send({message:'Hubo un error interno en el servidor'})
    }

})

router.delete('/:pid' , async(req,res) =>{
    const {pid} = req.params
    try {
        await productModel.deleteOne({_id : pid})
        res.status(202).send({message:'Producto eliminado con exito'})

    } catch (error) {        
        res.send({message: 'No existe producto con ese id'})
    }
    
})



export default router