import mongoose from "mongoose";

export default class MongoSingleton {
    static #instance
    
    constructor(){
        mongoose.connect('mongodb+srv://barrientosga22:40916271Gaby@cluster0.csihdak.mongodb.net/ecommerce?retryWrites=true&w=majority') , {
            useNewUrlParser : true,
            useUnifiedTopology : true
        }
    }

    static getInstance(){
        if(this.#instance){
            console.log('ya se encuentra conectado')
            return this.#instance
        }
        this.#instance = new MongoSingleton()
        console.log('conectado');
        return this.#instance
    }
}