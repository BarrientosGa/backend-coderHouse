import { Router } from "express";
import {productModel} from '../dao/models/product.model.js'

const router = Router()

router.get('/' , async(req,res)=>{
    const {limit , page , sort , filtro , filtroVal} =req.query
    const limitCustom = limit ?? 10
    const pageCustom = page ?? 1
    const sortCustom = sort ?? 0
    const filtroCustom = filtro
    const filtroValCustom = filtroVal
    try {
        //[filtroCustom] va ser reemplazado por categoria o disponibilidad
        if(filtro && filtroValCustom){
            const products = await productModel.paginate({[filtroCustom] : filtroValCustom} , {limit : limitCustom , page:pageCustom , sort:{price : sortCustom}  })
            res.send({status:'success' , payload: products})
        }
        else{
            const products = await productModel.paginate({} , {limit : limitCustom , page:pageCustom , sort:{price : sortCustom}  })
            res.send({status:'success' , payload: products})
        }
       

    } catch (error) {
       res.status(400).send({message : 'Hubo un error en el servidor'}) 
    }
})

router.get('/products' , async (req,res) => {
     let page = parseInt(req.query.page)
     if(!page) page=1
      //Lean es crucial para mostrar en Handlebars, ya que evita la "hidratación" del documento de mongoose,
     //esto hace que a Handlebars llegue el documento como plain object y no como Document.
     const products = await productModel.paginate({} , {page , limit:2 , lean:true})
     products.prevLink = products.hasPrevPage ? `http://localhost:8080/api/products/products?page=${products.prevPage}` : ''
     products.nextLink = products.hasNextPage? `http://localhost:8080/api/products/products?page=${products.nextPage}`: ''
     products.isValid= !(page<=0||page>products.totalPages)
     res.render('products',products)
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