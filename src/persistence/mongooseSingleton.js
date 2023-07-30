import mongoose from "mongoose";

export default class MongoSingleton {
    static #instance
    
    constructor(){
        mongoose.connect(process.env.DB_CONNECTION) , {
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