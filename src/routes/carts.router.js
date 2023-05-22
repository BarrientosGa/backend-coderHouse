import { Router } from "express";
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises'

const router = Router()

router.post('/' , async(req,res)=>{
    const {products} = req.body
    const dataInFile = await fs.readFile('src/files/carts.json' , 'utf-8')
    const cartPersistent = JSON.parse(dataInFile)
    const cart = {
        products
    }
    cart.id = uuidv4()
    cartPersistent.push(cart)
    await fs.writeFile('src/files/carts.json' , JSON.stringify(cartPersistent , null , '\t'))
    res.send({message: 'Se agrego el carrito correctamente'})
})

router.get('/:cid' , async(req,res)=>{
    const {cid} = req.params
    const dataInFile = await fs.readFile('src/files/carts.json' , 'utf-8')
    const cartPersistent = JSON.parse(dataInFile)
    const findCartById = cartPersistent.find(cart => cart.id === cid)
    if(findCartById){
        const {products} = findCartById
        res.send({products})
    }
    else {
        res.status(400).send({message : 'No existe carrito con ese id'})
    }
})

router.post('/:cid/product/:pid' , async(req,res)=>{
    const {cid , pid} = req.params
    const {code} = req.body
    const dataInFileCarts = await fs.readFile('src/files/carts.json' , 'utf-8')
    const cartPersistent = JSON.parse(dataInFileCarts)
    const findCartById = cartPersistent.find(cart => cart.id === cid)
    const productRepeat = findCartById && findCartById.products.findIndex(product => product.code === code) //retorna - 1 cuando no encuentra ningun producto repetido
    const quantityProduct = {
        product : pid,
        quantity : 0
    }

    if(findCartById){
        if(productRepeat === -1){
            quantityProduct.quantity ++
            findCartById.products.push(quantityProduct)
            cartPersistent.push(findCartById)
            await fs.writeFile('src/files/carts.json' , JSON.stringify(cartPersistent , null , '\t'))
            res.send({message: 'se agrego producto al carrito seleccionado'})
        }
        else {
            cartPersistent.map( cart =>{
                cart.products.map(product => {
                    if(product.product === pid){
                        product.quantity ++
                    }
                    return product
                })
            })
            await fs.writeFile('src/files/carts.json' , JSON.stringify(cartPersistent , null , '\t'))
            res.send()
        }
    }
    else{
        res.status(400).send({message: 'No existe carrito con ese id'})
    }

})

















export default router