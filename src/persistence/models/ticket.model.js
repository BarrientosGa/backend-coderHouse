import mongoose from "mongoose";

const collection = 'tickets'

const ticketSchema = new mongoose.Schema({
    code: {
        type : String,
        unique : true
    },
    purchase_datetime : String,
    products : {
        type : []
    },
    amount: Number,
    purchaser: String
})

const ticketModel = mongoose.model(collection , ticketSchema)

export default ticketModel;