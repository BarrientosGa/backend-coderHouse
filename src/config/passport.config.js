import passport from "passport";
import local from 'passport-local'
import userModel from "../persistence/models/user.model.js";
import {createHash , isValidPassword} from '../utils.js'
import GitHubStrategy from 'passport-github2'
import config from '../config/config.js'

const LocalStrategy = local.Strategy
const initializePassport = () => {
    passport.use('register' , new LocalStrategy(
        {passReqToCallback:true , usernameField:'email'} , async (req,username,password,done) => {
            const {first_name , last_name , email,age , role} = req.body
            try {
                let user = await userModel.findOne({email : username})
                if(user){
                    /* 
                        no encontrar un usuario no significa que sea un error, asique el error lo pasamos como null
                        pero el usuario como false. esto significa que ya existe el usuario
                    */
                    return done(null, false)
                }
                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    role,
                    password: createHash(password),
                    cartId : '652ea81b73b0ae559e21ba31' //carrito harcodeado
                }
                const result = await userModel.create(newUser)
                return done(null , result)
            } catch (error) {
                //cuando hay un error, entonces se manda done con el error indicado
                return done('error al obtener el usuario' + error)
            }
        }
    )),
    passport.use('login' , new LocalStrategy({usernameField:'email'} , async(username , password , done) => {
        try {
            if(username === 'admin@hotmail.com' && password === 'admin'){
                let user ={
                    name : 'Admin',
                    email : 'admin@hotmail.com',
                    age : 10 ,
                    role : 'admin',
                    id : 0,
                    cartId : '652ea81b73b0ae559e21ba31'
                }
                return done(null , user)
            }
            let user = await userModel.findOne({email:username})
            if(!user){
                return done(null,false)
            }
            if(!isValidPassword(user , password)) return done (null , false)
            user = {
                name : `${user.first_name} ${user.last_name}`,
                email : `${user.email}`,
                age : user.age ,
                role : `${user.role}`,
                id : user._id,
                cartId : user.cartId
            }
            return done(null , user)
        } catch (error) {
            return done(error)
        }
    })),
    passport.use('github' , new GitHubStrategy({
        clientID: config.client_id,
        clientSecret: config.client_secret,
        callbackURL : config.callback_url
    }, async (accessToken, refreshToken,profile , done) => {
        try {
            console.log(profile);
            let user = await userModel.findOne({email : profile._json.email})
            if(!user){
                let newUser = {
                    first_name : profile._json.name,
                    last_name : '',
                    email : profile._json.email,
                    age : 30,
                    password: ''
                }
                let result = await userModel.create(newUser)
                done(null , result)
            }
            else {//si entra aca es porque el usuario ya existia
                done(null , user)
            }
        } catch (error) {
            return done(error)
        }
    }
    ))
}

export default initializePassport