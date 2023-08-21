import { Router } from "express";
import { generateProduct } from "../utils/generateProducts.js";

const router = Router()

router.get('/' , (req , res) => {
    const productsFakes = []
    for (let i = 0; i < 100; i++) {
        productsFakes.push(generateProduct())
        
    }
    res.send({status:'success' , payload:productsFakes})
})














export default router