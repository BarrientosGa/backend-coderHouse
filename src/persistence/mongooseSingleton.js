import mongoose from "mongoose";
import config from '../config/config.js'

export default class MongoSingleton {
    static #instance
    
    constructor(){
        mongoose.connect(config.db_connection) , {
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