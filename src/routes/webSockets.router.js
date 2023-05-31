import { Router } from "express";
import fs from 'fs/promises'
import ProductManager from "../ProductManager.js";

const router = Router()
const manejadorDeProductos = new ProductManager();

router.get('/' , async(req,res) => {
    const dataInFile = await fs.readFile(manejadorDeProductos.path , 'utf-8')
    const products = JSON.parse(dataInFile)
    res.render('realTimeProducts', {
        products
    })
})


export default router