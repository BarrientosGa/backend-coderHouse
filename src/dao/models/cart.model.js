import mongoose from "mongoose";

const cartCollection = 'carts'

const cartSchema = new mongoose.Schema({
    products : [
        {
            title: String,
            description: String,
            code: {
                type : String,
                unique : true
            },
            price: Number,
            status: Boolean,
            category: String
        }
    ]
})

export const cartModel = mongoose.model(cartCollection , cartSchema)