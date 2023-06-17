import mongoose from "mongoose";

const productCollection = 'products'

const productSchema = new mongoose.Schema({
    title: {
        type : String,
        require: true
    },
    description: {
        type:String,
        require:true
    },
    code: {
        type : String,
        unique : true
    },
    price: {
        type:Number,
        require:true
    },
    status: Boolean,
    stock: {
        type:Number,
        require:true
    },
    category: {
        type:String,
        require:true
    }
})

export const productModel = mongoose.model(productCollection , productSchema)