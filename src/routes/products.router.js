import { Router } from "express";
import {productModel} from '../dao/models/product.model.js'

const router = Router()

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
            if(product){
                return res.send(product)
            }
            else{
                return res.send({message : 'El id no existe'})
            }
    } catch (error) {
        res.status(400).send({ status: 'Rejected', payload: error.message });
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

    const findFieldUndefined = Object.values(product).findIndex(value => value === undefined || null) //retorna -1 cuando no encuentra ni undefined | null

    try {
        const productRepeat = await productModel.findOne({code:code})
        if(findFieldUndefined === -1 && !productRepeat){
            product.thumbnails = thumbnails
            await productModel.create(product)
            return res.send({message: 'Se agrego producto con exito'})
        }
        else{
            return res.status(400).send({message: 'No paso las validaciones'})
        }
    } catch (error) {
        res.status(400).send({ status: 'Rejected', payload: error.message });
    }
})

router.put('/:pid' , async(req,res)=>{
    const {pid} = req.params
    const fieldUpdate = req.body

    try {
        const product = await productModel.findOne({_id:pid})
        if(product){
            await productModel.updateOne({_id:pid} , fieldUpdate)
            return res.status(201).send({message:'Producto actualizado con exito'})
        }
        else{
            return res.send({message : 'El id no existe'})
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({ status: 'Rejected', payload: error.message });
    }

})

router.delete('/:pid' , async(req,res) =>{
    const {pid} = req.params
    try {
        const product = await productModel.findOne({_id:pid})
        if (product) {
            await productModel.deleteOne({_id : pid})
            return res.status(202).send({message:'Producto eliminado con exito'})  
        } else {
            return res.send({message : 'El id no existe'})
        }
    } catch (error) {        
        res.status(400).send({ status: 'Rejected', payload: error.message });
    }
    
})



export default router