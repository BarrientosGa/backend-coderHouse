import {productModel} from '../persistence/models/product.model.js'

export const getProducts = async (limit,page,sort,filtro,filtroVal) => {
    const limitCustom = limit ?? 10
    const pageCustom = page ?? 1
    const sortCustom = sort ?? 0
    const filtroCustom = filtro
    const filtroValCustom = filtroVal


    if(filtro && filtroValCustom){
        await productModel.paginate({[filtroCustom] : filtroValCustom} , {limit:limitCustom , page:pageCustom , sort:{price:sortCustom}})
        return;
    }
    else {
        const products = await productModel.paginate({} , {limit:limitCustom , page:pageCustom , sort:{price:sortCustom}})
        return products;
    }
}

export const getProductById = async (id) => {
    const product = await productModel.findOne({_id: id})
    if(product){
        const product = await productModel.findOne({_id: id})
        return product;
    }
}

export const createProduct = async (product) => {
   /*  const findFieldUndefined = Object.values(product).findIndex(value => value === undefined || null) */
    const productRepeat = await productModel.findOne({code:product.code})

    if(!productRepeat){
        //product.thumbnails = thumbnails
      return await productModel.create(product);
    }

}

export const updateProductById = async(id , fieldUpdate) => {
    const product = await productModel.findOne({_id:id})

    if(product){
       const productUpdated = await productModel.updateOne({_id:id} , fieldUpdate)
        return productUpdated;
    }
    
}

export const deleteProductById = async(id , ) => {
    const product = await productModel.findOne({_id:id})

    if(product){
        const productDeleted = await productModel.deleteOne({_id:id})
        return productDeleted;
    }
    
}
