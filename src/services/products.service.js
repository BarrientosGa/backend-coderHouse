import {productModel} from '../persistence/models/product.model.js'

export const getProducts = async (limit,page,sort,filtroCustom,filtroValCustom) => {
    if(filtro && filtroValCustom){
        await productModel.paginate({[filtroCustom] : filtroValCustom} , {limit , page , sort:{price:sort}})
        return;
    }
    else {
        await productModel.paginate({} , {limit , page , sort:{price:sort}})
        return;
    }
}

export const getProductById = async (id) => {
    await productModel.findOne({_id: id})
    return;
}

export const createProduct = async (product) => {
    /* const findFieldUndefined = Object.values(product).findIndex(value => value === undefined || null) */

    await productModel.create(product)
    return;

}

export const updateProductById = async(id , fieldUpdate) => {
    await productModel.updateOne({_id:id} , fieldUpdate)
}

export const deleteProductById = async(id) => {
    await productModel.deleteOne({_id:id})
}