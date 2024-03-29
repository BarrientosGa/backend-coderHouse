import { Router } from "express";
import passport from "passport";
import { productModel } from "../persistence/models/product.model.js";
import { getProducts, getProductById, createProduct, updateProductById, deleteProductById } from '../services/products.service.js'
import { rolesMiddlwaresAdmin } from "./middlewares/roles.middlewares.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";

const router = Router()

router.get('/', async (req, res) => {
    const { limit, page, sort, filtro, filtroVal } = req.query

    try {
        const products = await getProducts(limit, page, sort, filtro, filtroVal)
        res.send({ products })
    } catch (error) {
        res.status(400).send({ message: 'Hubo un error en el servidor' })
    }
})

router.get('/products', passport.authenticate('jwt', { session: false }), async (req, res) => {
    let page = parseInt(req.query.page)
    if (!page) page = 1
    //Lean es crucial para mostrar en Handlebars, ya que evita la "hidratación" del documento de mongoose,
    //esto hace que a Handlebars llegue el documento como plain object y no como Document.
    const products = await productModel.paginate({}, { page, limit: 2, lean: true })
    products.prevLink = products.hasPrevPage ? `http://localhost:8080/api/products/products?page=${products.prevPage}` : ''
    products.nextLink = products.hasNextPage ? `http://localhost:8080/api/products/products?page=${products.nextPage}` : ''
    products.isValid = !(page <= 0 || page > products.totalPages)
    res.render('products', {
        product: products,
        user: req.user
    })
})


router.get('/:pid', async (req, res) => {
    const { pid } = req.params

    try {
        if (!isNaN(pid)) {
            CustomError.createError({
                name: 'id is not a string',
                cause: `the given id ${pid} is not a string`,
                message: 'cannot get products',
                code: EErrors.PARAM_ERROR
            })
        }
        else {
            const product = await getProductById(pid)
            res.send({ product })
        }

    } catch (error) {
        res.status(400).send({ status: 'Rejected', payload: error.message });
    }
})

router.post('/', passport.authenticate('jwt', { session: false }), rolesMiddlwaresAdmin, async (req, res) => {
    const { title, description, code, price, status = true, stock, category, thumbnails, owner='admin' } = req.body

    const product = {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        owner
    }

    try {
        const productCreated = await createProduct(product)
        if (productCreated) {
            await createProduct(product)
            res.send({ message: 'Se agrego correctame el producto' })
        }
        else {
            res.status(400).send({ message: 'Todos los campos son obligatorios' })
        }

    } catch (error) {
        res.status(400).send({ status: 'Rejected', payload: error.message });
    }
})

router.put('/:pid', passport.authenticate('jwt', { session: false }), rolesMiddlwaresAdmin, async (req, res) => {
    const { pid } = req.params
    const fieldUpdate = req.body

    try {
        await updateProductById(pid, fieldUpdate)
        return res.status(201).send({ message: 'Producto actualizado con exito' })
    } catch (error) {
        console.log(error);
        res.status(400).send({ status: 'Rejected', payload: error.message });
    }

})

router.delete('/:pid', passport.authenticate('jwt', { session: false }), rolesMiddlwaresAdmin, async (req, res) => {
    const { pid } = req.params
    const product = await productModel.findOne({ _id: pid })

    try {
        if (product) {
            await deleteProductById(pid)
            return res.status(201).send({ message: 'Producto eliminado con exito' })

        }
        else {
            return res.send({ message: 'Id no existe' })
        }
    } catch (error) {
        res.status(400).send({ status: 'Rejected', payload: error.message });
    }

})



export default router