import fs from 'fs'

class ProductManager {
    constructor() {
        this.products = []
        this.path = 'src/files/products.json'
    }

    async addProduct(title, description, price, thumbnail, code, stock) {
        const product = {
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }
        const findProduct = this.products.findIndex(product => product.code === code) //retorna -1 cuando no encontra ningun code igual
        const findFieldUndefined = Object.values(product).findIndex(value => value === undefined || null) //retorna -1 cuando no encuentra ni undefined | null

        if (findProduct === -1 && findFieldUndefined === -1) {
            if (this.products.length === 0) {
                product.id = 1
            }
            else {
                product.id = this.products[this.products.length - 1].id + 1
            }
            this.products.push(product)
            await fs.promises.writeFile(this.path , JSON.stringify(this.products , null , '\t'))
        }
        else {
            console.log('no paso las validaciones');
        }
    }

    async getProducts() {
        const dataInFile =await fs.promises.readFile(this.path , 'utf-8')
        return dataInFile;
    }

    async getProductById(id) {
        const dataInFile = await fs.promises.readFile(this.path , 'utf-8')
        const dataParsed = JSON.parse(dataInFile)
        const productById = await dataParsed.find(product => product.id === id)
        if (productById) {
            return productById
        }
        else {
            console.log('Not found');
        }
    }

    async updateProduct(id , fieldUpdate) {
        const dataInFile = await fs.promises.readFile(this.path , 'utf-8')
        const dataParsed = JSON.parse(dataInFile)
        const productById = dataParsed.find(product => product.id === id)

        if(productById){
            const productUpdate = {...productById , ...fieldUpdate}
            const productFiltered = this.products.filter(product => product.id !== id)
            productFiltered.push(productUpdate)
            await fs.promises.writeFile(this.path , JSON.stringify(productFiltered , null , '\t'))
        }
        else{
            console.log('Not found');
        }
    }
    async deleteProduct(id) {
        const dataInFile = await fs.promises.readFile(this.path , 'utf-8')
        const dataParsed = JSON.parse(dataInFile)
        const productDeletedById = dataParsed.filter(product => product.id !== id)

        await fs.promises.writeFile(this.path , JSON.stringify(productDeletedById , null , '\t'))
    }
}

export default ProductManager;

