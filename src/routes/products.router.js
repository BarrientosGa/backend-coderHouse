import { Router } from "express";
import fs from 'fs/promises'
import ProductManager from "../ProductManager.js";
import { v4 as uuidv4 } from 'uuid';

const router = Router()
const manejadorDeProductos = new ProductManager();

router.get('/' , async(req,res)=>{
    const {limit} =req.query
    const dataInFile = await fs.readFile(manejadorDeProductos.path , 'utf-8')
    const product = JSON.parse(dataInFile)
    if(limit){
       const newArrayProductForLimit = product.slice(0 , limit)
       res.send({newArrayProductForLimit})
    }
    else{
        res.send({product});
    }
})

router.get('/:pid' , async(req,res)=>{
    const {pid} = req.params
    const dataInFile = await fs.readFile(manejadorDeProductos.path , 'utf-8')
    const product = JSON.parse(dataInFile)
    const productById = await product.find(product => product.id === Number(pid))
    if(productById){
        res.send(productById)
    }
    else{
        res.send({message : 'El producto no existe'})
    }
})

router.post('/' , async(req , res) => {
    const {title , description, code, price , status=true , stock, category , thumbnails} = req.body
    const dataInFile = await fs.readFile(manejadorDeProductos.path , 'utf-8')
    const productPersistent = JSON.parse(dataInFile)
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
    const findProductWithCodeEqual = productPersistent.findIndex(product => product.code === code) //retorna -1 cuando no encontra ningun code igual

    if(findFieldUndefined === -1 && findProductWithCodeEqual === -1){
        product.thumbnails = thumbnails
        product.id = uuidv4() //genera un id dinamico
        productPersistent.push(product) //al archivo persistente se le pushea el nuevo product
        await fs.writeFile(manejadorDeProductos.path , JSON.stringify(productPersistent , null , '\t'))
        res.send({message: 'Se agrego producto con exito'})
    }
    else {
        res.status(400).send({message: 'No paso las validaciones'})
    }
})

router.put('/:pid' , async(req,res)=>{
    const {pid} = req.params
    const fieldUpdate = req.body
    const dataInFile = await fs.readFile(manejadorDeProductos.path , 'utf-8')
    const dataParsed = JSON.parse(dataInFile)
    const productById = dataParsed.find(product => product.id === pid)

    if(productById){
        const productUpdate = {...productById , ...fieldUpdate}
        const productFiltered = dataParsed.filter(product => product.id !== pid)
        productFiltered.push(productUpdate)
        await fs.writeFile(manejadorDeProductos.path , JSON.stringify(productFiltered , null , '\t'))
        res.status(201).send({message:'Producto actualizado con exito'})
    }
    else{
        res.status(400).send({message:'No existe producto con ese id'})
    }
})

router.delete('/:pid' , async(req,res) =>{
    const {pid} = req.params
    const dataInFile = await fs.readFile(manejadorDeProductos.path , 'utf-8')
    const dataParsed = JSON.parse(dataInFile)
    const productDeletedById = dataParsed.filter(product => product.id !== pid)

    await fs.writeFile(manejadorDeProductos.path , JSON.stringify(productDeletedById , null , '\t'))
    res.status(202).send({message:'Producto eliminado con exito'})
})

export default router