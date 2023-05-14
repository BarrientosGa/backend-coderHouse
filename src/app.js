import fs from 'fs/promises'
import express from 'express'
import ProductManager from './ProductManager.js';

const manejadorDeProductos = new ProductManager();
const app = express()

app.get('/products',  async(req , res)=>{
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

app.get('/products/:pid' , async(req , res) => {
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

app.listen(8080 , () => {
    console.log('Conectado al puerto 8080');
})