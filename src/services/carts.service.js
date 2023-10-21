import { cartModel } from "../persistence/models/cart.model.js"
import { productModel } from "../persistence/models/product.model.js"

export const addProductInCart = async(cart) => {
    const cartCreated = await cartModel.create(cart)
    return cartCreated.save()
}

export const getCartsById = async(cid) =>{
    return await cartModel.findOne({_id : cid}).populate('products.product').lean()
}


//deberá listar los productos que pertenezcan al carrito con el parámetro cid proporcionados.
export const getCartById = async(cid)=>{
    return await cartModel.findOne({_id : cid}).populate('products.product')
}

//deberá agregar el producto al arreglo “products” del carrito seleccionado
export const addProductInCartById = async (cid , pid) => {
    const product = await productModel.findOne({_id : pid})
    const cart = await cartModel.findOne({_id: cid})
    cart.products.push({product: product})
    cart.save()
    return;
}

//Debera eliminar del carrito id el producto seleccionado
export const deleteProductInCartById = async (cid , pid) => {
    const cart = await cartModel.findOne({_id: cid});
    //elimino un producto del carrito con el pull
    cart.products.pull(pid);
    cart.save();
    return;
}

//deberá actualizar el carrito con un arreglo de productos con el formato especificado arriba.
export const updateCartWithArrayProducts = async (cid , products) => {
    const cart = await cartModel.findOne({_id: cid})
    cart.products=[...products]
    await cart.save()
    return;
}

//deberá poder actualizar SÓLO la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body
export const updateStockProductInCartById = async (cid , pid , stock) => {
    const product = await productModel.findOne({_id : pid})
    const cart = await cartModel.findOne({_id : cid})
    product.stock = stock
    await product.save()
    await cart.save()
    return;
}

//Vacia los productos de un carrito seleccionado
export const deleteProductsInCartById = async (cid) => {
    const cart = await cartModel.findOne({_id: cid})
    cart.products=[]
    await cart.save()
    return;
}